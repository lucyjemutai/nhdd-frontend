import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import PersonTwoTone from '@mui/icons-material/PersonTwoTone';
import Link from 'next/link';
import { ArrowDropDown, SearchRounded, SearchTwoTone } from '@mui/icons-material';
import { TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { doLogout } from '@/utilities';


function NavBar({ session, loggedIn, user, pages }) {
    
    const settings = ['Profile', 'Help & FAQ', 'Logout'];
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const pathname = router.pathname;

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar position="static" color="default" variant="outlined" elevation={0}>
            <Container maxWidth="2xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                        <Link href={'/'}>
                            <img src="/assets/images/logo.png" alt="MoH KNHTS" width={'auto'} height={65} />
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                            <MenuIcon />
                        </IconButton>
                        <Menu id="menu-appbar" anchorEl={anchorElNav} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'left' }} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Link style={{ textDecoration: 'none', color: '#1651B6' }} href={page.link}>{page.name}</Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <Link href={'/'}>
                                <img src="/assets/images/logo.png" alt="MoH KNHTS" width={'auto'} height={40} />
                            </Link>
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'row', gap: {md: 1, lg: 3} }}>
                            {pages.map((page) => {
                                let active = (page.link.toLocaleLowerCase() == router.asPath?.toLocaleLowerCase())// || router.asPath?.toLocaleLowerCase().includes(page.link?.toLocaleLowerCase())
                                return (
                                <Link style={{ textDecoration: 'none', color: (active ? '#333' : '#1651B6'), fontSize: {md: '0.7em', lg: '0.9em'}, borderBottom: `2px solid ${(active ? '#333': 'transparent')}` }} key={page.name} href={page.link}>{page.name}</Link>
                            )})}
                        </Box>
                    </Box>
                    {!['/'].includes(pathname) && <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center' }}>
                            <Link href={'/search'} style={{ color: '#667' }}> <SearchRounded /> </Link>
                        </Box>
                            <Box variant="outlined" sx={{ display: { md: 'none', lg: 'flex' }, alignItems: 'center', px: 2 }}>
                                <TextField variant="outlined" color="primary" id="search" label="Global Search" name='q' size="small" sx={{ display: { xs: 'none', md: 'flex' }, width: 'auto' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <Button variant="outlined" size='small' sx={{ display: { xs: 'none', md: 'flex' }, p: 1 }} onClick={ev=>{
                                    router.push('/search?q='+searchQuery)
                                }}><SearchRounded m={4} /></Button>
                            </Box>
                    </Box>}

                    {(loggedIn && user) ? (
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: {xs: 0, md: 1}, border: '1px solid #ccc', color: 'black', py: 1, px: 1, borderRadius: '8px' }}>
                            <Button onClick={ev => {
                                if (anchorElUser) {
                                    handleCloseUserMenu()
                                } else {
                                    handleOpenUserMenu(ev)
                                }
                            }} sx={{ display: 'flex', color: 'black', justifyContent: 'space-between', py: 0, px: {xs: 0, md: 1} }}>
                                <Box sx={{ display: 'flex' }}>
                                    <PersonTwoTone />
                                    <Typography variant="p" sx={{ display: { xs: 'none', md: 'block', lineHeight: 'inherit' } }}>{user.username}</Typography>

                                    <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/user')
                                        }}>
                                            Dashboard
                                        </MenuItem>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/auth/profile')
                                        }}>
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            router.push('/help')
                                        }}>
                                            Help & FAQ
                                        </MenuItem>
                                        <MenuItem onClick={ev => {
                                            handleCloseUserMenu()
                                            doLogout()
                                        }}>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </Box>
                                <ArrowDropDown />
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 0 }}>
                            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}> <PersonTwoTone /> </IconButton>
                                </Tooltip>
                                <Menu sx={{ mt: '45px' }} id="menu-appbar" anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Login</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Request Account</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                <Button sx={{ borderRadius: '3em', mr: 2, backgroundColor: '#1651B6' }} size='large' variant="contained" color="primary" href="/auth/login">Login</Button>
                                <Button sx={{ borderRadius: '3em' }} variant="outline" size='small' color="primary" href="/auth/register">Request Account</Button>
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default NavBar;
