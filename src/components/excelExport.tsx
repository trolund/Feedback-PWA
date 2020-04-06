import ReactExport from 'react-export-excel'
import FeedbackDate from '../models/FeedbackDate'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ReactExport.ExcelFile
const { ExcelColumn } = ReactExport.ExcelFile

type excelDataset = {
  data: FeedbackDate[]
}

const DashboardExcelDownload = ({ data }: excelDataset) => {
  const exportData = data?.map(item => {
    return {
      answer: item.answer,
      date: item.date,
      categories: item.categories.join(',')
    }
  })

  return (
    <ExcelFile>
      <ExcelSheet
        data={exportData}
        name='Feedback'
        // element={
        //   <a role='button' tabIndex={0} className='button float-right'>
        //     Filter data
        //   </a>
        // }
      >
        <ExcelColumn label='Dato' value='date' />
        <ExcelColumn label='Tilbagemelding' value='answer' />
        <ExcelColumn label='Kategorier' value='categories' />
      </ExcelSheet>
    </ExcelFile>
  )
}

export default DashboardExcelDownload
