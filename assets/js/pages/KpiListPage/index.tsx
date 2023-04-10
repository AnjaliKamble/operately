import React from "react";
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

import ButtonLink from '../../components/ButtonLink';
import PageTitle from '../../components/PageTitle';
import Card from '../../components/Card';
import CardList from '../../components/CardList';

const GET_KPIS = gql`
  query GetKpis {
    kpis {
      id
      name
      description
    }
  }
`;

const KPI_SUBSCRIPTION = gql`
  subscription OnKpiAdded {
    kpiAdded {
      id
    }
  }
`;

export async function KpiListPageLoader(apolloClient : any) {
  await apolloClient.query({
    query: GET_KPIS,
    fetchPolicy: 'network-only'
  });

  return {};
}

function ListOfKpis({kpis}) {
  return (
      <CardList>
        {kpis.map(({id, name, description}: any) => (
          <Link key={name} to={`/kpis/${id}`}><Card>{name} - {description}</Card></Link>
        ))}
    </CardList>
  );
}

export function KpiListPage() {
  const { loading, error, data, subscribeToMore, refetch } = useQuery(GET_KPIS);

  React.useEffect(() => {
    subscribeToMore({
      document: KPI_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        refetch();
        return prev;
      }
    })
  }, [])

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <PageTitle
        title="Kpis"
        buttons={[
          <ButtonLink key="new" to="/kpis/new">New Kpi</ButtonLink>
        ]}
      />

      <ListOfKpis kpis={data.kpis} />
    </>
  )
}
