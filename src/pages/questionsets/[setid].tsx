/* eslint-disable func-names */
import { useState, useContext, useEffect } from 'react'
import https from 'https'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import { Plus, Save, Trash, Feather, Lock } from 'react-feather'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import fetch from 'isomorphic-unfetch'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import IQuestionSet from '../../models/QuestionSet'
import ApiRoutes from '../../stores/api/ApiRoutes'
import FetchStates from '../../stores/requestState'
import { auth } from '../../services/authService'
import rootStore from '../../stores/RootStore'
import QuestionListDrag from '../../components/questions/question-list-drag'
import { sortQuestionsByIndex } from '../../services/sortService'
import {
  makeid,
  prepareQuestionSetforUpdate
} from '../../services/utilsService'
import CustomConfirmModal from '../../components/essentials/confirm-modal'
import withAuth from '../../components/hoc/withAuth'

type pageProps = {
  initQSet: IQuestionSet
}

const QuestionSetPage: NextPage = observer(({ initQSet }: pageProps) => {
  const router = useRouter()
  const { setid } = router.query
  const [qset, setQset] = useState(initQSet)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showElement, setShowElement] = useState(false)

  const {
    questionSetStore: {
      fetchQuestionSet,
      updateQuestionSet,
      deleteQuestionSet,
      fetchQuestionSetNames
    },
    authStore: { getCompanyId }
  } = useContext(rootStore)

  // used to show or hide based on company ID

  useEffect(() => {
    const showBasedOnCompany = () =>
      getCompanyId() === qset.companyId ||
      getCompanyId() === Number(process.env.spinOffCompenyId)

    setShowElement(showBasedOnCompany())
  }, [getCompanyId, qset.companyId])

  useEffect(() => {
    if (qset === null) {
      fetchQuestionSet(String(setid)).then(() => {
        setQset(qset as IQuestionSet)
      })
    }

    return () => {
      fetchQuestionSetNames()
    }
  }, [fetchQuestionSet, qset, setid])

  const addQuestion = () => {
    qset.questions.push({
      theQuestion: '',
      index: qset.questions.length + 1,
      questionId: makeid(8)
    })
    setQset({ ...qset, questions: [...qset.questions] })
  }

  const deleteQuestion = (index: number) => {
    qset.questions.splice(index, 1)
    setQset({ ...qset, questions: [...qset.questions] })
  }

  const itemChange = (newQuestion: string, index: number) => {
    qset.questions[index].theQuestion = newQuestion
    setQset({ ...qset, questions: [...qset.questions] })
  }

  const updateClickHandler = () => {
    updateQuestionSet(prepareQuestionSetforUpdate(qset))
      .then(res => {
        if (res === FetchStates.DONE) toast('Sættet er opdateret!')
        else toast('Der skete en fejl ved Opdateringen!')
      })
      .catch(() => {
        toast('Der skete en fejl ved Opdateringen!')
      })
  }

  const deleteClickHandler = () => {
    deleteQuestionSet(qset)
      .then(res => {
        if (res === FetchStates.DONE) {
          toast('Spørgsmålssæt er slettet!')
          router.push('/questionsets')
        } else {
          toast('Der skete en fejl ved sletningen.')
        }
      })
      .catch(() => {
        toast('Der skete en fejl ved sletningen.')
      })
  }

  const sendTemplate = () => {
    router.push({
      pathname: '/questionsets/new',
      query: { setid: qset.questionSetId }
    })
  }

  const SaveBtn = () => {
    return (
      showElement && (
        <Save
          onClick={updateClickHandler}
          style={{
            height: '20px',
            width: '20px',
            marginRight: '7px',
            marginTop: '2px'
          }}
        />
      )
    )
  }

  // const showBasedOnCompany = useCallback(
  //   () =>
  //     getCompanyId() === qset.companyId ||
  //     getCompanyId() === Number(process.env.spinOffCompenyId),
  //   [getCompanyId, qset.companyId]
  // )

  return (
    <Page title={qset?.name} component={<SaveBtn />}>
      <Section>
        <CustomConfirmModal
          show={showConfirmModal}
          setShow={setShowConfirmModal}
          onConfirm={deleteClickHandler}
          titel='Bekræft sletning'
          content={
            <>
              <p>Er du sikker på du vil slette spørgsmålssættet {qset.name}.</p>
              <p>
                Alle tilbagemeldinger givet med dette sæt vil samtidigt blive
                slettet.
              </p>
            </>
          }
        />
        <div className='topbar'>
          {!showElement && (
            <p className='warning'>
              <Lock style={{ marginBottom: '-5px' }} /> Dette møde kan ikke
              ændres da det er et standard spørgsmålssæt
            </p>
          )}
          <input
            className='float-left name'
            type='text'
            placeholder='Sæt navn'
            value={qset.name}
            onChange={e => setQset({ ...qset, name: e.target.value })}
          />
        </div>
        <QuestionListDrag
          questionSet={qset}
          setQuestionSet={setQset}
          deleteFunc={deleteQuestion}
          changeItemFunc={itemChange}
        />
        {showElement && (
          <li className='addbtn'>
            <button
              type='button'
              className='button bottombtn'
              onClick={addQuestion}
            >
              <Plus
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '-20px',
                  float: 'left'
                }}
              />
              Tilføj spørgsmål
            </button>
          </li>
        )}
        <hr
          style={{ width: '120px', marginLeft: 'auto', marginRight: 'auto' }}
        />
        <li>
          <button
            type='button'
            className='button bottombtn'
            onClick={sendTemplate}
          >
            <Feather
              style={{
                width: '20px',
                height: '20px',
                marginRight: '-20px',
                float: 'left'
              }}
            />
            Brug som skabelon
          </button>
        </li>
        <hr
          style={{
            width: '120px',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: showElement ? 'block' : 'none'
          }}
        />
        <li style={{ display: showElement ? 'block' : 'none' }}>
          <button
            type='button'
            className='button bottombtn'
            onClick={() => setShowConfirmModal(true)}
            data-cy='delete-question-set'
          >
            <Trash
              style={{
                width: '20px',
                height: '20px',
                marginRight: '-20px',
                float: 'left'
              }}
            />
            slet
          </button>
        </li>
      </Section>
      <style jsx>{`
        @media only screen and (max-width: 400px) {
          .topbar {
            float: none;
          }
        }

        .warning {
          text-align: center;
          margin: auto;
          padding: 15px;
          padding-bottom: 25px;
        }

        .name {
          margin-right: auto;
          margin-left: auto;
          width: 100%;
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

QuestionSetPage.getInitialProps = async function(ctx) {
  const { query } = ctx
  const token = auth(ctx)
  const { setid } = query

  const options = {
    agent: new https.Agent({
      rejectUnauthorized: false // TODO fix for production with real SSL CERT
    })
  }
  const url = ApiRoutes.QuestionSetById(String(setid))
  let data: IQuestionSet | null = null
  try {
    const response = await fetch(url, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      ...options
    })
    data = await response.json()
    data = { ...data, questions: data.questions.sort(sortQuestionsByIndex) }
  } catch (e) {
    console.error(e)
  }
  return {
    initQSet: data
  }
}

export default withAuth(QuestionSetPage)
