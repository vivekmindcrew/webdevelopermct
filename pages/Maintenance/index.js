import React from "react";
import "./index.css"
import logoL from "../../logo1.png"
import Img from "../../img.png"

const maintenance = (props) => {
    return (
        <div>
            <div class="logo"><img src={logoL} alt="hghg" /></div>
            <div>
                <div class="fl">
                    <h1>the site is under<br />
                        <span>maintenance </span></h1>
                </div>
                <div class="fr">
                    <img class="image" src={Img} alt="maint" />
                </div>
                <div style={{ clear: "both" }}></div>
            </div>
        </div>
    );
}

export default maintenance;