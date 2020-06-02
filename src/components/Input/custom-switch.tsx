import { Check, X } from 'react-feather'
import Switch from 'react-switch'

type initState = {
  checked: boolean
  onChange?: (checked: boolean) => void
}

const CustomSwitch = ({ checked, onChange }: initState) => {
  return (
    <Switch
      onChange={onChange}
      checked={checked}
      onColor='#0594A6'
      offColor='#6a6b6e'
      uncheckedIcon={
        <X
          style={{
            width: '27px',
            height: '27px',
            padding: '5px',
            color: 'white'
          }}
        />
      }
      checkedIcon={
        <Check
          style={{
            width: '27px',
            height: '27px',
            padding: '5px',
            color: 'white'
          }}
        />
      }
    />
  )
}

export default CustomSwitch
