import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeSelectOwnerName } from "store/global/selectors";
import { SideNavContext } from "context/SideNavContext";
import AccountCard from "./AccountCard";
import PaymentsCard from "./PaymentsCard";
import QuickTransferCard from "./QuickTransferCard";
import CompleteSetup from "./CompleteSetup";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import { getInvitations } from "store/invitation/actions";

import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import OverviewCard from "./OverviewCard";
import AssetsCard from "./AssetsCard";
import RecentTxCard from "./RecentTxCard";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { getTokens } from "store/tokens/actions";

import { Greeting, CardsGrid } from "./styles";

const invitationKey = "invitation";
const tokensKey = "tokens";

export default function Dashboard() {
  const dispatch = useDispatch();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  return (
    <div>
      <Greeting>Hey, {ownerName}</Greeting>
      <CardsGrid>
        <OverviewCard />
        <AssetsCard />
        <RecentTxCard />
      </CardsGrid>
      {/* <AccountCard />
      {loadingSetupStatus && (
        <div className="status">
          <Card
            className="p-4 d-flex justify-content-center align-items-center"
            style={{ width: "33em" }}
          >
            <Loading color="primary" width="50px" height="50px" />
          </Card>
        </div>
      )}
      {!loadingSetupStatus &&
        (isSetupComplete ? <QuickTransferCard /> : <CompleteSetup />)}
      <PaymentsCard /> */}
    </div>
  );
}
