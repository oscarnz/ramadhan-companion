'use client'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  async function callApi() {
    const res = await fetch(`http://127.0.0.1:8000/test/vector?query=hello`)
    console.log(res)

    const data = await res.json()

    console.log(data)
  }

  return (
    <>
      <input type="text" />
      <Button
        onClick={() => {
          callApi()
        }}
      >
        test call api
      </Button>
    </>
  )
}