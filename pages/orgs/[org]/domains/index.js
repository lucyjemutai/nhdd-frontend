import { getResource } from '@/utilities'
import Image from "next/image";
import { SearchTwoTone } from '@mui/icons-material'
import { Box, Button, Chip, TextField, Typography, Grid } from '@mui/material'
import Head from 'next/head'
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Footer from '@/components/footer';

function OrgDomainsList() {
    const router = useRouter()
    const { org } = router.query
    const [orgDomains, setOrgDomains] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState("");


    useEffect(() => {
        let mounted = true
        // call to local api

        if (mounted) {
            setIsLoading(true)
            fetch('/api/domains').then(d => d.json()).then(data => {
                if (data) {
                    setOrgDomains(data)
                    setIsLoading(false)
                }
            }).catch(err => {
                console.error('error::', err)
            })
        }
        return () => mounted = false
    }, [router.query])

    const filteredData = Object.values(orgDomains).filter((row) =>
        Object.values(row).some(
            (value) =>
                typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    return (
        <>
            <Head>
                <title>MOH KNHTS | {org}</title>
                <meta name="description" content="MOH KNHTS" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '85vh' }}>
                <Box maxWidth={1280} sx={{ width: '100%', py: { xs: 2, md: 2 }, px: { xs: 1, md: 2 } }}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <button style={{ background: 'transparent', width: 'auto', border: 0, color: '#777', padding: 0 }} onClick={ev => {
                            ev.preventDefault()
                            router.back()
                        }}> &larr; Back</button>
                        <Typography variant="h3" m={0} align="left" fontWeight={'bold'} color="text.primary" gutterBottom> Domains </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField id="outlined-basic" label="Filter Domains" size='small' variant="outlined" sx={{ width: '100%', maxWidth: 500 }} onChange={(e) => setSearchTerm(e.target.value)} />
                            <Button variant="outlined" size='large' color='inherit' sx={{ ml: 1 }}> <SearchTwoTone /> </Button>
                        </Box>
                    </Box>
                    <hr />
                </Box>
                {filteredData.length > 0 ? (
                    <Box maxWidth={1280} sx={{ width: '100%', p: 1 }}>
                        <Grid container spacing={2}>
                            {filteredData.map((domain, index) => (
                                <Grid item key={domain.id} xs={12} md={6} lg={4}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 1, border: '1px solid #abc', p: 2, borderRadius: 3, backgroundColor: '#F5F5F5', height: '70%', }}>
                                        <Box sx={{ marginRight: 2 }}>
                                            <Image src={"/assets/images/" + domain.icon + ".png"} alt={domain.name} width={50} height={50} />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <Link href={`/orgs/${org}/domains/${domain.id}`} style={{ textDecoration: 'none', color: '#1651B6', display: 'flex', alignItems: 'center' }} title={domain.name}>
                                                <Typography variant="h5" m={0} align="left" fontWeight={'semibold'} color="text.primary" sx={{ ":hover": { color: '#1651B6', textDecoration: 'underline' } }} gutterBottom> {domain.name} </Typography>
                                            </Link>
                                            {domain.sources_data?.filter(d => d && JSON.stringify(d) !== '[]')?.length > 0 ? <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontSize: '0.9em', mx: 1, mb: 1 }}>
                                                    <span className='text-stone-500'>Source(s):</span> <span style={{ fontWeight: '500', color: 'black' }}>{domain.sources_data[0]?.short_code || '-'}</span>
                                                </Box>
                                                {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontSize: '0.9em', mx: 1, mb: 1 }}>
                                                    <span className='text-stone-500'>Mappings:</span> <span style={{ fontWeight: '500', color: 'black' }}>{new Intl.NumberFormat().format(domain.sources_data[0]?.summary?.active_mappings) || 0}</span>
                                                </Box> */}
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontSize: '0.9em', mx: 1, mb: 1 }}>
                                                    <span className='text-stone-500'>Concepts:</span> <span style={{ fontWeight: '500', color: 'black' }}>{new Intl.NumberFormat().format(domain.sources_data[0]?.summary?.active_concepts) || 0}</span>
                                                </Box>
                                            </Box> : <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%', fontSize: '0.8em' }}>
                                                <span style={{ fontWeight: '500' }}>&nbsp;</span>
                                            </Box>
                                            }

                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', height: '96vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}

            </Box>
            <div>
                <Footer />
            </div>
        </>

    )
}

export default OrgDomainsList
