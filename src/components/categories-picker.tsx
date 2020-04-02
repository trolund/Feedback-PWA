import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { observer } from 'mobx-react-lite'
import Category from '../models/Category'
import OptionsValue from '../models/OptionsValue'
import MeetingModel from '../models/MeetingModel'

type Props = {
  categories: Category[]
  setTags: (values: OptionsValue[]) => void
  values?: Category[]
}

// https://react-select.com/styles

export default observer(({ categories, setTags, values }: Props) => {
  const animatedComponents = makeAnimated()

  return (
    <>
      <Select
        defaultValue={
          values
            ? [
                ...values.map(item => {
                  console.log('item', item)

                  return {
                    value: item.categoryId,
                    label: item.name
                  } as OptionsValue
                })
              ]
            : [{ label: 'hej', value: 'hej' }]
        }
        options={categories?.map(
          cat =>
            ({
              label: cat.name,
              value: cat.categoryId
            } as OptionsValue)
        )}
        styles={{
          multiValueLabel: base => ({
            ...base,
            backgroundColor: 'var(--accent)',
            color: 'white'
          }),
          input: base => ({
            ...base,
            boxShadow: 'none !important'
          }),
          control: base => ({
            ...base,
            background: 'var(--surface)',
            border: 'none',
            padding: '7px'
          }),
          multiValueRemove: base => ({
            ...base,
            background: 'var(--accent)'
          }),
          multiValue: base => ({
            ...base,
            background: 'var(--accent)'
          })
        }}
        theme={theme => ({
          ...theme,
          borderRadius: 15,

          colors: {
            ...theme.colors,
            primary: 'var(--accent)',
            neutral0: 'var(--base)'
          }
        })}
        isMulti
        components={animatedComponents}
        // defaultValue={['var(--text)']}
        onChange={(tag: OptionsValue[]) => {
          if (tag) {
            setTags(tag)
          } else {
            setTags([])
          }
        }}
      />

      {/* <style jsx>{``}</style> */}
    </>
  )
})
