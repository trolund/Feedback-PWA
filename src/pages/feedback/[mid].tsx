import { useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import Lottie from 'react-lottie'
import Page from '../../components/page'
import states from '../../stores/requestState'
import questionStore from '../../stores/QuestionStore'
import * as find from '../../../public/Animations/findmeeting.json'

const Post = observer(() => {
  const router = useRouter()
  const { mid } = router.query
  const { fetchQuestions, fetchState } = useContext(questionStore)

  useEffect(() => {
    fetchQuestions(String(mid)).then((result: states) => {
      if (result === states.DONE) {
        Router.push('/survage')
      } else {
        // setErrorMsg('Noget gik galt')
      }
    })
  }, [fetchQuestions, mid])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: (find as any).default,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  return (
    <Page showHead={false} showBottomNav={false}>
      {fetchState === states.LOADING && (
        <div className='overlay'>
          <div className='ani'>
            <Lottie options={defaultOptions} height={300} width={300} />
          </div>
        </div>
      )}
      {fetchState === states.FAILED && (
        <div className='center'>
          <p className='center' style={{ textAlign: 'center' }}>
            Mødet med id <b>{mid}</b> er ikke fundet.
          </p>
        </div>
      )}
      <style jsx>{`
        .ani {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
        }
        .overlay {
          height: 100%;
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          z-index: 100;
          background: var(--base);
        }
      `}</style>
    </Page>
  )
})

export default Post
