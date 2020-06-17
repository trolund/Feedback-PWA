import ReactExport from 'react-export-excel'
import FeedbackDate from '../../models/FeedbackDate'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ReactExport.ExcelFile
const { ExcelColumn } = ReactExport.ExcelFile

type excelDataset = {
  data: FeedbackDate[]
  downloadBtn: JSX.Element
}

const DashboardExcelDownload = ({ data, downloadBtn }: excelDataset) => {
  const exportData = data?.map(item => {
    return {
      answer: item.answer,
      date: item.date,
      categories: item.categories.join(','),
      meetingId: item.meetingId
    }
  })

  return (
    <ExcelFile element={downloadBtn}>
      <ExcelSheet data={exportData} name='Feedback'>
        <ExcelColumn label='Møde ID' value='meetingId' />
        <ExcelColumn label='Dato' value='date' />
        <ExcelColumn label='Tilbagemelding' value='answer' />
        <ExcelColumn label='Kategorier' value='categories' />
      </ExcelSheet>
    </ExcelFile>
  )
}

export default DashboardExcelDownload
