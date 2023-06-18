type user = {
  firstName: string;
  fullFirstName: string;
  insertion?: string | undefined;
  lastName: string;
  geboortedatum: string;
  gender: string;
  profilePicture: string;
  userId: 40202617;
};

export function userAdapter(eduarteUser) {
  return {
    firstName: eduarteUser.roepnaam,
    fullFirstName: eduarteUser.voornamen,
    insertion: eduarteUser.voorvoegsel,
    lastName: eduarteUser.achternaam,
    geboortedatum: eduarteUser.geboortedatum,
    gender: eduarteUser.geslacht,
    profilePicture: eduarteUser.pasfotoURL,
    userId: eduarteUser.deelnemernummer,
  };
}
