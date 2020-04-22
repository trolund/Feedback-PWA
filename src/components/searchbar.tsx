import { useState, useEffect } from 'react'
import { Search } from 'react-feather'
import CustomInput from './custom-input'

type SearchBarProps = {
  show: boolean
  searchWord: string
  setSearchWord: (newSearchWord: string) => void
}

const SearchBar = ({ searchWord, setSearchWord, show }: SearchBarProps) => {
  const [maxHeight, setMaxHeight] = useState('0px')

  useEffect(() => {
    setMaxHeight(show ? '94vh' : '0px')
  }, [show])

  return (
    <header style={{ maxHeight }}>
      <CustomInput
        className='meeting-id-input center'
        type='text'
        placeholder='Møde ID'
        value={searchWord}
        onChange={e => setSearchWord(e)}
        fill
        logo={
          <Search style={{ width: '20px', height: '20px' }} color='white' />
        }
        center
      />
      <style jsx>{`
        header {
          padding: 0 var(--gap);
          padding-top: env(safe-area-inset-top);
          width: 100%;
          height: calc(env(safe-area-inset-top) + 72px);
          background: var(--base);
          border-bottom: 1px solid var(--divider);
          display: flex;
          align-items: center;
          z-index: 10;
          position: fixed;
          top: 0;
          left: 0;
          transition: var(--transition-colors);
        }

        header h3 {
          width: 50%;
          margin: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
      `}</style>
    </header>
  )
}

export default SearchBar
