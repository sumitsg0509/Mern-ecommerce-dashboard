// React import
import React from "react";

function Profile(){

  // localStorage मधून user data घेणे
  const user = JSON.parse(localStorage.getItem("user"));

  return(

    <div className="profile">

      <h1>User Profile</h1>

      {/* User information card */}
      <div className="profile-card">

        <p><b>Name :</b> {user?.name}</p>

        <p><b>Email :</b> {user?.email}</p>

      </div>

    </div>

  )

}

export default Profile;