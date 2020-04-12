import { useState } from 'react'
import fetch from 'isomorphic-unfetch'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import Router from 'next/router'
import { Plus } from 'react-feather'
import cookies from 'next-cookies'
import Page from '../../components/page'
import Section from '../../components/section'
import QuestionSetList from '../../components/questionset-list'
import QuestionSet from '../../models/QuestionSet'
import ApiRoutes from '../../stores/api/ApiRoutes'
import withAuth from '../../services/withAuth'

type pageProps = {
  initPageProps: QuestionSet[]
}

const AllQuestionSets: NextPage = withAuth(
  observer(({ initPageProps }: pageProps) => {
    const [list, setList] = useState(initPageProps)

    const addQuestionSetClickHandler = () => {
      Router.push(`/questionsets/new`)
    }

    const deleteQuestion = (qSetId: string, index: number) => {
      list.splice(index, 1)
      setList([...list])
    }

    return (
      <Page
        title='Alle spørgsmålssæt'
        component={<Plus onClick={addQuestionSetClickHandler} />}
      >
        <Section>
          <QuestionSetList questionSetlist={list} deleteFunc={deleteQuestion} />
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
)

AllQuestionSets.getInitialProps = async ctx => {
  const { jwttoken } = cookies(ctx)
  const url = ApiRoutes.QuestionSetNames
  let data: QuestionSet[] | null = null
  try {
    const response = await fetch(url, {
      headers: !jwttoken ? {} : { Authorization: `Bearer ${jwttoken}` }
    })
    data = await response.json()
  } catch (e) {
    console.error(e)
  }
  return {
    initPageProps: data
  }
}

export default AllQuestionSets
