import {Route} from 'react-router';
import Layout from './components/navigation/Layout';
import Home from './components/home/Home';
import AdminWorkshops from './components/adminWorkshops/adminWorkshops';
import * as React from 'react';
import User from './components/user/User';
import WorkshopRegistration from './components/workshops/WorkshopRegistration';

export default () => (
    <Layout>
        <Route exact path='/' component={Home}/>
        <Route path='/user/' component={User}/>
        <Route path='/workshop_registration/' component={WorkshopRegistration}/>
        <Route path='/admin_workshops/' component={AdminWorkshops}/>
    </Layout>
);
