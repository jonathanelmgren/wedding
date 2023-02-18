'use client'
import './globals.css'
import { useState } from 'react'
import Image from 'next/image'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import Link from 'next/link'
import logo from '../../public/images/logo.png'
import balloon1 from '../../public/images/balloon1.png'
import balloon2 from '../../public/images/balloon2.png'
import heartballoon from '../../public/images/heartballoon.png'
import ring from '../../public/images/ring.png'
interface form {
  namn: string | undefined,
  plusOne: boolean,
  attendance: string | undefined,
  partySong: string | undefined
  food: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<form>({ namn: undefined, plusOne: false, attendance: undefined, partySong: '', food: '' })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/sendmail?form=' + JSON.stringify(form))
      if (res.ok) {
        setMessage('Tack för din OSA :)')
      } else {
        throw new Error('Nope')
      }
    } catch (e) {
      setMessage('Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <Parallax pages={4.3} style={{ top: '0', left: '0' }}>
        <ParallaxLayer
          offset={0}
          speed={0}
          factor={3}
          className='opacity-20'
          style={{
            backgroundImage: 'url("/images/clouds.png")',
            backgroundSize: '200%',
            backgroundRepeat: 'repeat-y',
            backgroundPosition: 'center center',
          }}
        />
        <ParallaxLayer
          offset={0}
          speed={0}
          className='grid place-content-center opacity-0 animate-fade-in animation-delay-500'
        >
          <Image className='cover-contain' width={'250'} height={'250'} src={logo} alt='alt' />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          speed={0.3}
        >
          <Image style={{ marginLeft: '10%' }} width={'100'} height={'100'} src={balloon2} alt='alt' />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.75}
          speed={0.2}
        >
          <Image style={{ marginLeft: '60%' }} width={'100'} height={'100'} src={balloon1} alt='alt' />
        </ParallaxLayer>
        <ParallaxLayer
          offset={2.5}
          factor={2}
          speed={0.2}
          className='z-10'
        >
          <Image className='ml-auto mr-4' width={'100'} height={'100'} src={heartballoon} alt='alt' />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1}
          factor={2}
          speed={1}
          className='opacity-0 animate-fade-in scale-x-100 z-20'
        >
          <h2>
            Jonathan <br /> & <br /> Alfrida
            <span className='block text-center text-2xl text-black'>15.07.23</span>
          </h2>
          <p>
            Vi önskar er varmt välkomna till vår bröllopsfest den 15 juli med massvis av god mat och gott sällskap. Nedan hittar ni information om vår speciella dag, och glöm inte att OSA längst ner på hemsidan senast den 31 maj.
          </p>
          <br />
          <p>
            Det kommer bli så skoj!
          </p>
        </ParallaxLayer>
        <ParallaxLayer
          offset={2}
          className='bg-gradient-to-b from-transparent to-sky'
        />
        <ParallaxLayer
          offset={1.8}
          factor={2}
          speed={0.3}
          className='z-10'
        >
          <h2>Viktig info</h2>
          <h4>Plats</h4>
          <p>Vi kommer att vistas på idylliska Näs Herrgård i Mullsjö <small>(Bjurbäck Näs 1, 565 92 Mullsjö)</small> under hela firandet. Vigseln kommer att hållas utomhus och festen kommer att hållas i ladan.</p>
          <p>Eftersom det kan bli lite kallt på kvällen är det bra att ta med sig något varmare att ta på sig.</p>
          <h4>Gåvor</h4>
          <p>Istället för en bröllopsgåva vill vi gärna att ni unnar er en övernattning på ett närliggande boende så att vi kan fira tillsammans hela natten lång.</p>
          <h4>Boende</h4>
          <p>Det finns ett flertal hotell och campingar i Mullsjö. Det är även nära till Jönköping (25min) om man vill ta sig dit istället. Eftersom det är högsäsong så kan det vara bra att boka boende så snart som möjligt.</p>
          <br />
          <p>Ni har även möjlighet att ta med er husvagn, husbild eller tält för den delen och ställa upp på plats. (Obs! Ingen el)</p>
          <br />
          <p>Här kommer ett par boenden i närheten:</p>
          <div className='width flex flex-col underline'>
            <Link href='https://hotellmullsjo.se/'>Hotell Mullsjö</Link>
            <Link href='https://hotellbjorkhaga.se/'>Björkhaga Hotell</Link>
            <Link href='http://www.mullsjocamping.se/'>Mullsjö Camping</Link>
          </div>
          <h4>Dresscode</h4>
          <p>Finklätt!</p>
          <p>Glöm ej att en del av dagen spenderas utomhus.</p>
          <h4>Mat & Dryck</h4>
          <p>Fyll i eventuella allergier eller matpreferenser i OSA:t</p>
          <p>Bubbel och tilltugg kommer att finnas vid brudskålen. Till middagen fixar vi dryck, men till festen får ni ta med eget.</p>
          <h4>Övrigt</h4>
          <p>Vi älskar era barn men just denna dagen vill vi fira tillsammans med våra vuxna vänner.</p>
          <p>Absolut ingen konfetti får vistas på området</p>
          <br />
          <p>Eventuella tal anmäls till vår toastmaster</p>
          <p>Peter Tornham: 0704 - 62 64 99</p>
        </ParallaxLayer>
        <ParallaxLayer
          offset={3}
          factor={2}
          speed={0.5}
          className='z-10'
        >
          <h2>Schema</h2>
          <ul className='mx-auto max-w-[15rem] flex flex-col gap-2'>
            <li className='flex items-center justify-between opacity-30'><Image src={ring} alt="ring" width='50' height='50' /> Vigsel</li>
            <li className='flex items-center justify-between'><span>14.00</span> <span>Ankomst</span></li>
            <li className='flex items-center justify-between'><span>15.00</span> <span>Brudskål & mingel</span></li>
            <li className='flex items-center justify-between'><span>17.00</span> <span>Middag</span></li>
            <li className='flex items-center justify-between'><span>20.00</span> <span>Tårta</span></li>
            <li className='flex items-center justify-between'><span>21.00</span> <span>FEST</span></li>
          </ul>
          <p className='mt-5 text-center'>Vår vigsel har vi valt att hålla kort och endast för familj</p>
        </ParallaxLayer>
        <ParallaxLayer
          offset={3.7}
          factor={1}
          speed={0.1}
          className='z-20'
        >
          <h2 className='mb-0'>OSA</h2>
          <span className='block mb-4 text-center text-md text-black'>Senast 31 maj</span>
          <form className='width grid gap-3' onSubmit={onSubmit}>
            <input value={form.namn} onChange={(e) => setForm({ ...form, namn: e.target.value })} required type="text" placeholder="Namn" />
            <div className='flex gap-2'>
              <input checked={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.checked })} type="checkbox" id="plus_one" /><label htmlFor="plus_one">+1</label>
            </div>
            <input value={form.food} onChange={(e) => setForm({ ...form, food: e.target.value })} type="text" placeholder="Matpreferenser (allergier, veg osv)" />
            <div>
              <label htmlFor="">Jag kommer att närvara</label>
              <div className='flex gap-2 items-center'>
                <input onChange={(e) => setForm({ ...form, attendance: e.target.value })} required type="radio" name="attendance" value="attendance_yes" id="attendance_yes" />
                <label htmlFor="attendance_yes">Ja</label>
              </div>
              <div className='flex gap-2 items-center'>
                <input onChange={(e) => setForm({ ...form, attendance: e.target.value })} required type="radio" name="attendance" value="attendance_no" id="attendance_no" />
                <label htmlFor="attendance_no">Nej</label>
              </div>
            </div>
            <input value={form.partySong} onChange={(e) => setForm({ ...form, partySong: e.target.value })} type="text" placeholder="Min absolut bästa partylåt" />
            <div className='text-primary text-xl'>
              {loading ? 'Laddar..' : message}
            </div>
            <button type="submit" className='bg-primary px-2 py-1 rounded-md mt-2 text-white cursor-pointer'>Skicka</button>
          </form>
        </ParallaxLayer>
      </Parallax>
    </main >
  )
}
