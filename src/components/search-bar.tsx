import { Search } from 'react-feather'

type SeachbarProps = {
  value: string
  setValue: (newVlaue: string) => void
}

const Seachbar: React.FC<SeachbarProps> = ({ value, setValue }) => (
  <>
    <input
      type='search'
      placeholder='Søg efter navne på møder'
      value={value}
      onChange={e => setValue(e.target.value)}
    />
    <Search className='searchicon' />
    {/* <style jsx>{`
        input {
          padding-left: 50px;
          width: 100%;
        }

        .searchicon {
          padding: 10px;
          position: absolute;
          margin-top: -30px;
        }

        @media only screen and (max-width: 650px) {
          input {
            width: 100%;
          }
        }
      `}</style> */}
  </>
)

export default Seachbar
