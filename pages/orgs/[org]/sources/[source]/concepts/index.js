import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function ConceptsList() {
  const router = useRouter()
  const {org, source} = router.query
  useEffect(() => {
    router.push(`/orgs/${org}/sources/${source}`)
  }, [])
  return (
    <div>Loading...</div>
  )
}

export default ConceptsList