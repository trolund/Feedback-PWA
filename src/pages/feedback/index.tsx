import { useContext, useState } from 'react'
import { observer } from 'mobx-react'
import Lottie from 'react-lottie'
import { Hash, Smile, Maximize } from 'react-feather'
import Link from 'next/link'
import Router from 'next/router'
import * as loading from '../../../public/Animations/loading.json'
import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import withAuth from '../../components/hoc/withAuth'
import rootStore from '../../stores/RootStore'
import CustomInput from '../../components/Input/custom-input'
import FetchStates from '../../stores/requestState'
import { getIOSVersion } from '../../services/deviceInfoService'
import { logEvent } from '../../utils/analytics'

const Task = withAuth(
  observer(() => {
    const {
      questionStore: { isMeetingOpen, fetchState }
    } = useContext(rootStore)
    const [errorMsg, setErrorMsg] = useState('')
    const [meetingId, setMeetingId] = useState('')

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: (loading as any).default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

    const checkMeetingClickHandler = () => {
      // Todo Split into service - også brugt i root index side
      setErrorMsg('')
      isMeetingOpen(meetingId).then((result: boolean) => {
        if (result) {
          logEvent('Meeting open', 'send to feedback')
          Router.push(`/feedback/${meetingId}`)
        } else {
          setErrorMsg('Noget gik galt')
          logEvent('Meeting open', 'error')
        }
      })
    }
    return (
      <Page title='Tilbagemelding' showBackButton={false}>
        <Section>
          <ul>
            <li>
              <CustomInput
                error={errorMsg.length > 0}
                className='meeting-id-input center'
                type='text'
                placeholder='Møde ID'
                value={meetingId}
                onChange={e => setMeetingId(e)}
                fill
                logo={
                  fetchState === FetchStates.LOADING ? (
                    <div style={{ marginTop: '-7px', marginLeft: '-7px' }}>
                      <Lottie options={defaultOptions} height={35} width={35} />
                    </div>
                  ) : (
                    <Hash style={{ width: '20px', height: '20px' }} />
                  )
                }
                center
              />
            </li>
            <li>
              <button
                title='login'
                aria-label='login'
                onClick={checkMeetingClickHandler}
                onKeyDown={checkMeetingClickHandler}
                type='button'
                tabIndex={0}
                className='center button bottombtn'
                data-cy='submit'
              >
                <Smile
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '-20px',
                    float: 'left'
                  }}
                  color='white'
                />
                Giv Feedback
              </button>
            </li>
            {(getIOSVersion() >= 13 || getIOSVersion() === undefined) && (
              <li>
                <Link href='/scanner' key='scanner'>
                  <button
                    title='scanner'
                    type='button'
                    aria-label='scanner'
                    className='button bottombtn'
                  >
                    <Maximize
                      style={{
                        width: '20px',
                        height: '20px',
                        marginRight: '-20px',
                        float: 'left'
                      }}
                      color='white'
                    />
                    Scan kode
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </Section>
        <style jsx>{`
          .label {
            display: block;
            width: 100%;
          }
          .info {
            width: 100%;
          }
          li {
            color: var(--fg);
            padding: var(--gap-small);
            background: var(--base);
            display: flex;
            align-items: center;
            transition: var(--transition-colors);
          }

          li:not(:last-child) {
            border-bottom: 1px solid var(--divider);
          }

          h4 {
            color: var(--fg);
            margin-left: var(--gap-small);
            font-weight: 500;
            letter-spacing: 0.0035em;
          }
        `}</style>
      </Page>
    )
  })
)

export default Task
