const {Router} = require('express')
const router = new Router();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Room = require('../models/Room.model');
const Reviews = require('../models/Reviews.model');
const { findByIdAndUpdate, findById } = require('../models/User.model');

