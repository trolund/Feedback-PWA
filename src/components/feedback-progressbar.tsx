type props = {
  question: string
  voteAVG: number
  questionNumber: number
}

const FeedbackProcessbar = ({ question, questionNumber, voteAVG }: props) => {
  const procent = voteAVG * 25

  return (
    <div className='con'>
      <p className='question'>
        <b>{questionNumber}</b> - {question}
      </p>
      <div className='top'>
        <div className='processbar-backdrop'>
          <div className='processbar' style={{ width: `${procent}%` }}>
            {voteAVG.toFixed(2)}
          </div>
        </div>
      </div>
      <div className='bottom'>
        <span className='step step-border float-left first-step'>
          <p className='voteNumber'>0</p>
        </span>
        <span className='step float-right last-step'>
          <p className='voteNumber'>2</p>
          <p className='lastNumber float-right'>3</p>
        </span>
        <span className='step step-border float-left'>
          <p className='voteNumber'>1</p>
        </span>
        {/* <span className="step step-border float-right">
        <p className="voteNumber">2</p>
        <p className="lastNumber float-right">3</p>
      </span> */}
      </div>

      <style jsx>{`
        .processbar {
          transition: width 0.3s ease-in;
          height: 30px;
          background-color: var(--accent);
          border-radius: var(--border-radius);
          padding: 5px;
          text-align: center;
        }
        .processbar-backdrop {
          background-color: var(--surface);
          height: 30px;
          width: 100%;
          border-radius: var(--border-radius);
        }
        .con {
          width: 100%;
          position: relative;
          padding-top: 15px;
          padding-bottom: 25px;
        }
        .question {
          margin-bottom: 40px;
        }

        .step {
          width: calc(33.33333%);
          height: 20px;
          background-color: #eee;
          z-index: -1;
          position: relative;
        }

        .step-border {
          border-right: rgb(104, 125, 141) 2px solid;
        }

        .step:last-child {
          border-left: none;
        }

        .first-step {
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;
        }

        .last-step {
          border-bottom-right-radius: 10px;
          border-top-right-radius: 10px;
        }

        .bottom {
          float: none;
          margin-top: -20px;
        }

        .top {
          float: none;
        }

        .voteNumber {
          margin-top: -25px;
          margin-left: -5px;
        }

        .lastNumber {
          margin-top: -40px;
          margin-right: -5px;
        }

        /* .bg-awesome {
  background-color: rgb(25, 137, 111);
} */

        .bg-awesome {
          background-color: rgb(25, 137, 111);
          height: 20px;
          mix-blend-mode: darken;
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}

export default FeedbackProcessbar
