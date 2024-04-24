import React from 'react';
import Navbar from './Components/Navbar';
import Themestate from './Context/Theme/themestate';
import Info from './Context/Info/Info';
import Video from './Context/video/Video';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './Components/Home';
import Check from './Components/Check';
import Profile from './Components/Profile';
import About from './Components/organism/About';
import Pabout from './Components/organism/Pabout';
import Community from './Components/organism/Community';
import Pcommunity from './Components/organism/Pcommunity';
import Miniside from './Components/Miniside';
import Vid from './Components/Vid';
import Upload from './Components/organism/Upload'
import Pro from './Components/Pro';

const App = () => {
  return (
    <Info>
      <Video>
        <Themestate>
          <Router>
          <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path='/check' element={<Check />} />
              <Route exact path='/video/:id' element={<Vid />} />
              <Route path='profile' element={<Profile />}>
                <Route path='about' element={<About/>}/>
                <Route path='community' element={<Community/>}/>
                <Route path='upload' element={<Upload/>}/>
              </Route>
              <Route path='/pro/:id' element={<Pro/>}>
              <Route path='pabout' element={<Pabout/>}/>
              <Route path='pcommunity' element={<Pcommunity/>}/>
              </Route>
            </Routes>
            <div className=''>
              <Navbar />
            </div>
            <div className='flex'>
              <div>
                <Miniside/>
              </div>
              <div>
                <Outlet/>
              </div>
            </div>
    
          </Router>
        </Themestate>
      </Video>
    </Info>
  );
};

export default App;