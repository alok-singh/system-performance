import React, { Component } from 'react';
import {get, post} from '../../common/api';
import Loader from '../common/loader';

// import '../../css/common/loader.less';

export default class LoginComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return <div className="container">
            login
        </div>
    }
}