// /// <reference types="jest" />

import * as SonarPlanetAPI from "../src/sonarplanetAPI"


describe('SonarPlanet API', () => {

  beforeEach((done) => {
    sessionStorage.clear();
    done();
  })

  it('getBrowserId returns a unique id, thx to sessionStorage', done => {
    let idSet = new Set();
    for (var i = 0; i < 4000; i++) {
      idSet.add(SonarPlanetAPI.getBrowserId());
    }
    expect(idSet.size).toEqual(1);
    done();
  })

  it('getBrowserId store unique id in session storage', done => {
    expect(sessionStorage.getItem(SonarPlanetAPI.SONAR_PLANET_ID_SESSION_STORAGE)).toBeNull();
    SonarPlanetAPI.getBrowserId();
    expect(sessionStorage.getItem(SonarPlanetAPI.SONAR_PLANET_ID_SESSION_STORAGE)).not.toBeNull();
    done();
  })

  it('getBrowserId store unique id in session storage once', done => {
    expect(sessionStorage.getItem(SonarPlanetAPI.SONAR_PLANET_ID_SESSION_STORAGE)).toBeNull();
    SonarPlanetAPI.getBrowserId();
    SonarPlanetAPI.getBrowserId();
    expect(sessionStorage.getItem(SonarPlanetAPI.SONAR_PLANET_ID_SESSION_STORAGE)).not.toBeNull();
    expect(sessionStorage.length).toEqual(1)
    done();
  })

  it('getUniqueId generates 4000 different id', done => {
    let idSet = new Set();
    for (var i = 0; i < 4000; i++) {
      idSet.add(SonarPlanetAPI.getUniqueId());
    }
    expect(idSet.size).toEqual(4000);
    done();
  })

})
