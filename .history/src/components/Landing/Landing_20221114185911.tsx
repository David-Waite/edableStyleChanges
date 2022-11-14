import { useEffect, useState } from "react";
import "./Landing.css";
import { Link, Navigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { Button, Container, Carousel, Row, Col } from "react-bootstrap";
import { ReactComponent as InclusionHero } from "./InclusionHero.svg";

import Sidebar from "./Sidebar";
import ItemsCollection from "./ItemsCollection";
import Organisation from "../Organisation/Organisation";
import { Console } from "console";

function Landing() {
  const [orgList, setOrgList] = useState<any>([]);

  // gets all the orgs from dbs
  useEffect(() => {
    const q = query(
      collection(db, "Organisations"),
      where("activeStatus", "==", true)
    );
    onSnapshot(q, (querySnapshot) => {
      // setOrgList dumps all the orgs in orgList
      setOrgList(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [dropDownOrg, setDropDownOrg] = useState(false);
  function focusedIn() {
    setDropDownOrg(true);
  }

  function focusedOut() {
    setTimeout(() => setDropDownOrg(false), 150);
  }

  const [search, setSearch] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredOrganisations = orgList.filter((Organisations: any) =>
    Organisations.data.name.toLowerCase().includes(search.toLowerCase())
  );
  function handleKeyPress(target: any) {
    if (target.charCode === 13) {
      console.log(filteredOrganisations[0].data.id);
      <Navigate to={`organisation/${filteredOrganisations[0].data.id}`} />;
    }
  }

  return (
    //   these lines set up the format of the page
    <>
      <div className="landing">
        {/* Burger menu */}

        <div className="App" id="outer-container">
          {/* Carousel */}
          <div className="slideshowCon">
            <Row>
              <Col>
                <div className="carouselContainer">
                  <Carousel
                    touch={true}
                    interval={4000}
                    indicators={true}
                    variant="light"
                  >
                    {orgList.map((org: any) => (
                      <Carousel.Item
                        key={org.id.toString()}
                        style={{
                          textAlign: "left",
                        }}
                      >
                        <Link
                          to={`organisation/${org.id}`}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                        >
                          {/* this div contains the carousel item's contents and makes the whole carousel item a link (based on link tag above) */}
                          <div className="carousel-contents">
                            <img
                              className="carouselImage"
                              src={`${org.data.img}`}
                            />

                            <div className="caroursel-text">
                              <div className="carousel-contents-bottom">
                                <div>
                                  {" "}
                                  <h2 className="title">{org.data.name}</h2>
                                  <p className="orgSummary">
                                    {org.data.summary}
                                  </p>
                                </div>

                                <Button
                                  className="btnContribute"
                                  variant="warning"
                                >
                                  DONATE TO&#160;
                                  {org.data.name.toUpperCase()}!
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <div>
          <div className="selectOrgCon">
            <h2 className="selectOrg">Donate to microbusinesses directly:</h2>
            <div
              className="orgSearchBar"
              onFocus={focusedIn}
              onBlur={focusedOut}
            >
              <input
                className="input"
                type="text"
                placeholder="Search microbusiness"
                onFocus={focusedIn}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
              <div
                className="orgNameCon"
                style={{
                  display: dropDownOrg ? "block" : "none",
                }}
              >
                {filteredOrganisations.map((item: any) => (
                  <Link key={item.data.id} to={`organisation/${item.data.id}`}>
                    <div className="orgName">
                      <a>{item.data.name}</a>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <h2 className="pageTitle">
            or Donate to <span>selected</span> items below
          </h2>
        </div>

        <ItemsCollection orgList={orgList} />
      </div>
    </>
  );
}

export default Landing;
