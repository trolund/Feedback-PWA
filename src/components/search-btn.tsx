import { Search } from 'react-feather'

type SearchBtnProps = {
  inputOpen: boolean
  setInputOpen: (bool: boolean) => void
  searchWord: string
  setSearchWord: (word: string) => void
}

const SearchBtn: React.FC<SearchBtnProps> = ({
  inputOpen,
  searchWord,
  setInputOpen,
  setSearchWord
}) => {
  return (
    <div>
      <Search
        className='searchiconbtn float-left'
        onClick={() => setInputOpen(!inputOpen)}
      />
      <input
        type='search'
        className={
          inputOpen
            ? 'searchInput-before searchInput float-right'
            : 'searchInput-before float-right'
        }
        value={searchWord}
        onChange={e => setSearchWord(e.target.value)}
      />

      <style jsx>{`
         {
          /* @media only screen and (min-width: 800px) {
          .searchInput-before {
            width: calc(100vw - 120px) !important;
            max-width: 400px;
            left: calc(25px + 25px);
          }
        } */
        }

        .searchInput-before {
          margin-top: -25px !important;
          width: calc(100vw - 120px) !important;
          max-width: 400px;
          padding: 16px !important;
          opacity: 0;
          position: fixed;
          top: calc(var(--safe-area-inset-top) / 2 + (72px / 2));
          left: 50%;
          transform: translateX(-50%);
          z-index: 99;
          border-radius: var(--border-radius);
          transition: all 0.3s ease-in-out !important;
        }
        .searchInput {
          opacity: 1;
          display: block !important;
        }
      `}</style>
    </div>
  )
}

export default SearchBtn
