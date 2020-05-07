import Page from '../../components/essentials/page'
import Section from '../../components/essentials/section'

const Aboute = () => {
  return (
    <Page title='Om Opino'>
      <Section>
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
        <b>Kontakt os på info@spinoff.nu.</b>
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

        .cam-view section div {
          box-shadow: rgba(0, 255, 0, 0.5) 0px 0px 0px 5px inset !important;
        }
      `}</style>
    </Page>
  )
}

export default Aboute
