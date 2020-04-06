import ReactExport from 'react-export-excel'
import FeedbackDate from '../models/FeedbackDate'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ReactExport.ExcelFile
const { ExcelColumn } = ReactExport.ExcelFile

type excelDataset = {
  data: FeedbackDate[]
}

const DashboardExcelDownload = ({ data }: excelDataset) => {
  return (
    <ExcelFile>
      <ExcelSheet
        data={data}
        name='Feedback'
        // element={
        //   <a role='button' tabIndex={0} className='button float-right'>
        //     Filter data
        //   </a>
        // }
      >
        <ExcelColumn label='Dato' value='date' />
        <ExcelColumn label='Tilbagemelding' value='answer' />
      </ExcelSheet>
    </ExcelFile>
  )
}

export default DashboardExcelDownload
