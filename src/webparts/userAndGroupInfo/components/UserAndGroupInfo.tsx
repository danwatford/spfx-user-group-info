import * as React from "react";
import styles from "./UserAndGroupInfo.module.scss";
import { IUserAndGroupInfoProps } from "./IUserAndGroupInfoProps";
import SpUserGroupLookup from "../../../services/SpUserGroupLookup";
import AadUserGroupLookup from "../../../services/AadUserGroupLookup";
import UserInfo from "./UserInfo";
import UserGroupMemberships from "./UserGroupMemberships";
import UserSelection from "./UserSelection";

const UserAndGroupInfo: React.FunctionComponent<IUserAndGroupInfoProps> = (props) => {
  const [aadUserGroupLookup] = React.useState(new AadUserGroupLookup());
  const [userGroupLookup] = React.useState(new SpUserGroupLookup(aadUserGroupLookup));

  // We use a SiteUserId of 0 to refer to the current user.
  const [siteUserId, setSiteUserId] = React.useState(0);
  const [email, setEmail] = React.useState(undefined);

  // Since we are defaulting to the current user we can consider that a user is selected.
  const [userIsSelected, setUserIsSelected] = React.useState(true);

  const onSelectedUserChanged = (siteUserId: number, email: string) => {
    console.debug("Selected user changed.", siteUserId, email);
    setSiteUserId(siteUserId);
    setEmail(email);
    setUserIsSelected(siteUserId !== undefined || email !== undefined);
  };

  let selectedUserContent;
  if (userIsSelected) {
    selectedUserContent = (
      <>
        <UserInfo
          siteUserInfoPromise={userGroupLookup.getSpUserAndMemberGroupsPromise(siteUserId)}
          aadUserPromise={aadUserGroupLookup.getAadUser(email)}
        />
        <UserGroupMemberships membershipsPromise={userGroupLookup.getUserMemberships(siteUserId, email)} />
      </>
    );
  } else {
    selectedUserContent = <p>Please select a user.</p>;
  }

  return (
    <div className={styles.userAndGroupInfo}>
      <div className={styles.container}>
        <UserSelection
          context={props.context}
          userGroupLookup={userGroupLookup}
          onSelectedUserChanged={onSelectedUserChanged}
        />
        {selectedUserContent}
      </div>
    </div>
  );
};

export default UserAndGroupInfo;
