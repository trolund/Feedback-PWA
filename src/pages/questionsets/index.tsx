import { useState, useContext } from 'react'
import fetch from 'isomorphic-unfetch'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { toast } from 'react-toastify'
import https from 'https'
import Router from 'next/router'
import { Plus } from 'react-feather'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import QuestionSetList from '../../components/questions/questionset-list'
import IQuestionSet from '../../models/QuestionSet'
import ApiRoutes from '../../stores/api/ApiRoutes'
import { auth } from '../../services/authService'

import FetchStates from '../../stores/requestState'
import rootStore from '../../stores/RootStore'
import withAuth from '../../components/hoc/withAuth'

type pageProps = {
  initPageProps: IQuestionSet[]
}

const AllQuestionSets: NextPage = observer(({ initPageProps }: pageProps) => {
  const [list, setList] = useState(initPageProps)
  const {
    questionSetStore: { deleteQuestionSet, fetchQuestionSetNames }
  } = useContext(rootStore)

  const addQuestionSetClickHandler = () => {
    Router.push(`/questionsets/new`)
  }

  const optimisticDeleteQuestion = (qSet: IQuestionSet, index: number) => {
    list.splice(index, 1)
    setList([...list])

    deleteQuestionSet(qSet)
      .then(res => {
        if (res === FetchStates.DONE) {
          toast('Spørgsmålssæt er slettet!')
          Router.push('/questionsets')
        } else {
          toast('Der skete en fejl ved sletningen.')
          fetchQuestionSetNames()
        }
      })
      .catch(() => {
        toast('Der skete en fejl ved sletningen.')
        fetchQuestionSetNames()
      })
  }

  return (
    <Page
      title='Alle spørgsmålssæt'
      component={
        <Plus data-cy='add-questionset' onClick={addQuestionSetClickHandler} />
      }
    >
      <Section>
        <QuestionSetList
          questionSetlist={list}
          deleteFunc={optimisticDeleteQuestion}
        />
      </Section>
      <style jsx>{`
        @media only screen and (max-width: 400px) {
          .name {
            margin-right: auto;
            margin-left: auto;
            text-align: center;
            float: none;
          }

          .topbar {
            float: none;
          }
        }

        .topbar {
          width: 100%;
          padding: 10px;
          height: calc(2vw * 20);
          max-height: 120px;
        }
      `}</style>
    </Page>
  )
})

AllQuestionSets.getInitialProps = async ctx => {
  const token = auth(ctx)
  const url = ApiRoutes.QuestionSetNames
  let data: IQuestionSet[] | null = null

  const options = {
    agent: new https.Agent({
      rejectUnauthorized: false // TODO fix for production with real SSL CERT
    })
  }
  try {
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })
    data = await response.json()
  } catch (e) {
    console.error(e)
  }
  return {
    initPageProps: data
  }
}

export default withAuth(AllQuestionSets)
