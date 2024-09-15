defmodule Operately.Operations.GoalCheckIn do
  alias Ecto.Multi
  alias Operately.{Repo, Activities}
  alias Operately.Goals.{Goal, Update, Target}
  alias Operately.Operations.Notifications.{Subscription, SubscriptionList}

  def run(author, goal, attrs) do
    targets = Operately.Goals.list_targets(goal.id)
    encoded_new_target_values = encode_new_target_values(targets, attrs.target_values)

    Multi.new()
    |> SubscriptionList.insert(attrs)
    |> Subscription.insert(author, attrs)
    |> Multi.insert(:update, fn changes ->
      Update.changeset(%{
        goal_id: goal.id,
        author_id: author.id,
        message: attrs.content,
        targets: encoded_new_target_values,
        subscription_list_id: changes.subscription_list.id,
      })
    end)
    |> SubscriptionList.update(:update)
    |> update_goal_next_check_in(goal)
    |> update_targets(targets, attrs.target_values)
    |> record_activity(author, goal)
    |> Repo.transaction()
    |> Repo.extract_result(:update)
    |> case do
      {:ok, update} ->
        OperatelyWeb.ApiSocket.broadcast!("api:assignments_count:#{author.id}")
        {:ok, update}

      error -> error
    end
  end

  defp update_goal_next_check_in(multi, goal) do
    next_check_in = Operately.Time.calculate_next_monthly_check_in(
      goal.next_update_scheduled_at,
      DateTime.utc_now()
    )

    Multi.update(multi, :goal, Goal.changeset(goal, %{
      next_update_scheduled_at: next_check_in
    }))
  end

  defp record_activity(multi, author, goal) do
    multi
    |> Activities.insert_sync(author.id, :goal_check_in, fn changes -> %{
      company_id: goal.company_id,
      goal_id: goal.id,
      update_id: changes.update.id,
    } end)
  end

  defp update_targets(multi, targets, new_target_values) do
    Enum.reduce(new_target_values, multi, fn target_value, multi ->
      target = Enum.find(targets, fn target -> target.id == target_value["id"] end)
      changeset = Target.changeset(target, %{value: target_value["value"]})
      id = "target-#{target.id}"

      Multi.update(multi, id, changeset)
    end)
  end

  defp encode_new_target_values(targets, new_target_values) do
    Enum.map(new_target_values, fn target_value ->
      target = Enum.find(targets, fn target -> target.id == target_value["id"] end)

      Map.from_struct(target)
      |> Map.merge(%{
        value: target_value["value"],
        previous_value: target.value
      })
    end)
  end
end
