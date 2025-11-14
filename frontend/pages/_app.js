import '../app/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  )
}
