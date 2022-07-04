const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const fs = require('fs-extra');

chai.use(chaiHttp);

describe('API ENDPOINT TESTING', () => {
  it('GET Landing Page', (done) => {
    chai.request(app).get('/api/v1/landing-page').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('hero');
      expect(res.body.hero).to.have.all.keys('city', 'treasure', 'traveler');
      expect(res.body.hero.city).to.be.a('number');
      expect(res.body.hero.treasure).to.be.a('number');
      expect(res.body.hero.traveler).to.be.a('number');
      expect(res.body).to.haveOwnProperty('mostPicked');
      expect(res.body.mostPicked).to.have.an('array');
      expect(res.body).to.haveOwnProperty('category');
      expect(res.body.category).to.have.an('array');
      expect(res.body).to.haveOwnProperty('testimonial');
      expect(res.body.testimonial).to.have.an('object');
      done();
    });
  });

  it('GET Detail Page', (done) => {
    chai.request(app).get('/api/v1/detail-page/5e96cbe292b97300fc902225').end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('_id');
      expect(res.body).to.haveOwnProperty('title');
      expect(res.body).to.haveOwnProperty('country');
      expect(res.body).to.haveOwnProperty('city');
      expect(res.body).to.haveOwnProperty('isPopular');
      expect(res.body).to.haveOwnProperty('description');
      expect(res.body).to.haveOwnProperty('sumBooking');
      expect(res.body).to.haveOwnProperty('categoryId');
      expect(res.body).to.haveOwnProperty('imageId');
      expect(res.body.imageId).to.be.an('array');
      expect(res.body).to.haveOwnProperty('featureId');
      expect(res.body.featureId).to.be.an('array');
      expect(res.body).to.haveOwnProperty('activityId');
      expect(res.body.activityId).to.be.an('array');
      expect(res.body).to.haveOwnProperty('bank');
      expect(res.body.bank).to.be.an('array');
      expect(res.body).to.haveOwnProperty('testimonial');
      expect(res.body.testimonial).to.be.an('object');
      done();
    });
  });

  it('POST Booking Page', (done) => {
    const image = __dirname + '/buktibayar.jpeg';
    const dataSample = {
      image,
      idItem: '5e96cbe292b97300fc902225',
      duration: 2,
      bookingStartDate: '07-04-2022',
      bookingEndDate: '07-06-2022',
      firstName: 'Udin',
      lastName: 'Saepudin',
      email: 'udin@gmail.com',
      phoneNumber: '081230923992',
      accountHolder: 'Udin',
      bankFrom: 'BNI',
    };
    chai.request(app).post('/api/v1/booking-page')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .field('idItem', dataSample.idItem)
      .field('duration', dataSample.duration)
      .field('bookingStartDate', dataSample.bookingStartDate)
      .field('bookingEndDate', dataSample.bookingEndDate)
      .field('firstName', dataSample.firstName)
      .field('lastName', dataSample.lastName)
      .field('email', dataSample.email)
      .field('phoneNumber', dataSample.phoneNumber)
      .field('accountHolder', dataSample.accountHolder)
      .field('bankFrom', dataSample.bankFrom)
      .attach('image', fs.readFileSync(dataSample.image), 'buktibayar.jpeg')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201);
        expect(res.body).to.have.an('object');
        expect(res.body).to.haveOwnProperty('message');
        expect(res.body.message).to.be.a('string');
        expect(res.body.message).to.equal('Booking success');
        expect(res.body).to.haveOwnProperty('booking');
        expect(res.body.booking).to.have.all.keys('invoice', 'bookingStartDate', 'bookingEndDate', 'total', 'itemId', 'memberId', 'payments', '_id', '__v');
        expect(res.body.booking.itemId).to.have.all.keys('_id', 'title', 'price', 'duration');
        expect(res.body.booking.payments).to.have.all.keys('paymentProof', 'fromBank', 'fromAccount', 'status');
        done();
      });
  });
});
