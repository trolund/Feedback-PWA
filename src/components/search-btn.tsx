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
      <input
        type='search'
        className={
          inputOpen
            ? 'searchInput-before searchInput float-left'
            : 'searchInput-before float-left'
        }
        value={searchWord}
        onChange={e => setSearchWord(e.target.value)}
      />
      <Search
        className='searchiconbtn float-right'
        onClick={() => setInputOpen(!inputOpen)}
      />

      <style jsx>{`
        .searchiconbtn {
           {
            /* position: fixed !important;
          top: 0px !important;
          right: 15px !important; */
          }
        }
        .searchInput-before {
          margin-top: -18px !important;
          margin-right: 40px !important;
          max-width: 500px;
          padding-left: 0px !important;
          padding-right: 0px !important;
          opacity: 0;
          width: 0px !important;
          transition: all 0.3s ease-in-out !important;
        }
        .searchInput {
          opacity: 1;
          display: block !important;
          border-radius: var(--border-radius);
          padding: 16px !important;
          width: calc(100vw - 120px) !important;
          position: relative;
        }
      `}</style>
    </div>
  )
}

export default SearchBtn
