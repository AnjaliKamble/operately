defmodule OperatelyWeb.Graphql.Types.ActivityContent do
  #
  # This file is generated by: mix operately.gen.elixir.graphql.schema
  # Do not edit this file directly.
  #

  use Absinthe.Schema.Notation

  union :activity_content do
    types [
      :activity_content_discussion_comment_submitted,
    :activity_content_discussion_editing,
    :activity_content_discussion_posting,
    :activity_content_goal_archived,
    :activity_content_goal_check_in,
    :activity_content_goal_check_in_acknowledgement,
    :activity_content_goal_check_in_edit,
    :activity_content_goal_created,
    :activity_content_goal_editing,
    :activity_content_group_edited,
    :activity_content_project_archived,
    :activity_content_project_check_in_acknowledged,
    :activity_content_project_check_in_commented,
    :activity_content_project_check_in_edit,
    :activity_content_project_check_in_submitted,
    :activity_content_project_closed,
    :activity_content_project_contributor_addition,
    :activity_content_project_created,
    :activity_content_project_discussion_submitted,
    :activity_content_project_goal_connection,
    :activity_content_project_goal_disconnection,
    :activity_content_project_milestone_commented,
    :activity_content_project_moved,
    :activity_content_project_pausing,
    :activity_content_project_renamed,
    :activity_content_project_resuming,
    :activity_content_project_review_acknowledged,
    :activity_content_project_review_commented,
    :activity_content_project_review_request_submitted,
    :activity_content_project_review_submitted,
    :activity_content_project_timeline_edited,
    :activity_content_task_adding,
    :activity_content_task_assignee_assignment,
    :activity_content_task_closing,
    :activity_content_task_description_change,
    :activity_content_task_name_editing,
    :activity_content_task_priority_change,
    :activity_content_task_reopening,
    :activity_content_task_size_change,
    :activity_content_task_status_change,
    :activity_content_task_update
    ]

    resolve_type fn %{action: action}, _ ->
      String.to_atom("activity_content_#{action}")
    end
  end
end
