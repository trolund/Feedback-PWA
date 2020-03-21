import VoteScale from '../models/vote'

interface IProp {
  on: boolean
  setVote: (vote: VoteScale) => void
  type: VoteScale
  img: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Smiley: React.FC<IProp> = ({ img, type, setVote, on }) => {
  // const { innerWidth: width } = window

  const onClickHandler = () => {
    setVote(type)
  }

  // const dimStyle = width < 350 ? 'lowScreenOption' : 'option'

  return (
    <div
      role='button'
      tabIndex={0}
      onKeyDown={onClickHandler}
      onClick={onClickHandler}
    >
      <div />

      <style jsx>{`
        .option {
          width: 80;
          height: 80;
          border-radius: 50;
          display: 'flex';
          background-image: url(img);
        }
        .lowScreenOption {
          width: 60;
          height: 60;
          border-radius: 50;
          display: 'flex';
        }
        .off {
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}

export default Smiley
