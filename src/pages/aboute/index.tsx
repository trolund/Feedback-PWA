import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'
import { savedTokenValid } from '../../services/authService'
import { fontsize } from '*.jpg'

const Aboute = () => {
  return (
    <Page title='Om Opino' showBottomNav={savedTokenValid()}>
      <Section>
        <div className='img-container center'>
          <img src='/images/logo.png' />
        </div>

        <p>
          Tillykke med din Opino app. Du har nu taget det første skridt på din
          rejse mod at blive bedre til det du gør. Feedback giver dig mulighed
          for at udvikle dig, blive klogere på, hvad du kan gøre anderledes, og
          hvad du i forvejen gør godt.
        </p>
        <br />
        <p>
          Du har nu mulighed for at få direkte feedback og følge din egen
          personlige udvikling. Feedback skal være hurtigt, effektivt og
          værdifuldt. Er du i tvivl om, hvordan du omsætter den feedback du får,
          står vi altid klar til at hjælpe dig.
        </p>
        <br />
        <b>
          Kontakt os på <a href='mailto: info@spinoff.nu'>info@spinoff.nu</a>.
        </b>
        <div className='img-container2 center'>
          <a href='http://spinoff.nu'>
            <img src='/images/spinoff_logo_color.gif' />
          </a>
        </div>
        <p
          style={{
            fontSize: '10px',
            color: 'var(--label)',
            textAlign: 'center',
            padding: '12px'
          }}
        >
          Beta - V0.1
        </p>
      </Section>
      <style jsx>{`
        .container {
          position: absolute;
          left: 0;
          right: 0;
          padding-top: 50px;
          position: absolute;
          min-width: 100%;
          min-height: 100%;
        }

        .img-container {
          background: var(--gradiant);
          padding: var(--gap);
          margin-bottom: var(--gap);
          border-radius: var(--border-radius);
          max-width: 350px;
        }

        .img-container2 {
          background-color: #ccc;
          padding: var(--gap);
          margin-top: var(--gap);
          border-radius: var(--border-radius);
          max-width: 350px;
        }

        .cam-view section div {
          box-shadow: rgba(0, 255, 0, 0.5) 0px 0px 0px 5px inset !important;
        }
      `}</style>
    </Page>
  )
}

export default Aboute
