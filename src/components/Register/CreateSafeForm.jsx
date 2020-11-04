import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";

import { useActiveWeb3React, useContract } from "hooks";
import Button from "components/common/Button";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import saga from "store/register/saga";
import { useInjectSaga } from "utils/injectSaga";
import { registerUser } from "store/register/actions";
import { makeSelectLoading } from "store/register/selectors";
import { library } from "@fortawesome/fontawesome-svg-core";

const key = "register";
const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS } = addresses;

export default function CreateSafeButton() {
  const loading = useSelector(makeSelectLoading());
  useInjectSaga({ key, saga });
  const dispatch = useDispatch();
  const { account } = useActiveWeb3React();
  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      owner_address_1: account,
    },
  });
  const gnosisSafeMasterContract = useContract(
    GNOSIS_SAFE_ADDRESS,
    GnosisSafeABI,
    true
  );

  const proxyFactory = useContract(
    PROXY_FACTORY_ADDRESS,
    ProxyFactoryABI,
    true
  );

  const getOwnersFromValues = (values) => {
    const ownersAddress = Object.keys(values)
      .map((key) => key.includes("owner_address") && values[key])
      .filter(Boolean);
    const ownersName = Object.keys(values)
      .map((key) => key.includes("owner_name") && values[key])
      .filter(Boolean);

    const owners = [];
    for (let i = 0; i < ownersName.length; i++) {
      owners.push({ name: ownersName[i], address: ownersAddress[i] });
    }

    return owners;
  };

  const createSafe = useCallback(
    async (values) => {
      console.log({ values });
      let body;

      if (gnosisSafeMasterContract && proxyFactory && account) {
        /// @dev Setup function sets initial storage of contract.
        /// @param _owners List of Safe owners.
        /// @param _threshold Number of required confirmations for a Safe transaction.
        /// @param to Contract address for optional delegate call.
        /// @param data Data payload for optional delegate call.
        /// @param fallbackHandler Handler for fallback calls to this contract
        /// @param paymentToken Token that should be used for the payment (0 is ETH)
        /// @param payment Value that should be paid
        /// @param paymentReceiver Adddress that should receive the payment (or 0 if tx.origin)
        const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
          "setup",
          [
            [
              "0x9ef14db2e143a0061577ab69538c5fd2a269f973",
              "0xf1f1762862aa42d9ddf90b71686762402b6ed8ae",
            ],
            1,
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000",
            0,
            "0x0000000000000000000000000000000000000000",
          ]
        );

        if (values.referralId) {
          // Execute Meta transaction

          const owners = getOwnersFromValues(values);
          body = {
            name: values.name,
            referralId: values.referralId,
            // safeAddress: "",
            createdBy: account,
            owners,
            proxyData: {
              from: account,
              params: [GNOSIS_SAFE_ADDRESS, creationData],
            },
          };
        } else {
          // Execute normal transaction
          // Create Proxy
          const estimateGas = await proxyFactory.estimateGas.createProxy(
            GNOSIS_SAFE_ADDRESS,
            creationData
          );

          const tx = await proxyFactory.createProxy(
            GNOSIS_SAFE_ADDRESS,
            creationData,
            { gasLimit: estimateGas }
          );

          const deployedProxy = proxyFactory.once(
            "ProxyCreation",
            (proxy) => proxy
          );

          const result = await tx.wait();
          console.log("tx success", result);

          const owners = getOwnersFromValues(values);
          body = {
            name: values.name,
            safeAddress: deployedProxy.address,
            createdBy: account,
            owners,
            proxyData: {
              from: account,
              params: [GNOSIS_SAFE_ADDRESS, creationData],
            },
          };
        }
      }
      console.log({ body });
      dispatch(registerUser(body));
    },
    [gnosisSafeMasterContract, proxyFactory, account, dispatch]
  );

  return (
    <div>
      <form onSubmit={handleSubmit(createSafe)}>
        <div>
          <label htmlFor="name" className="mr-3">
            Organization Name
          </label>
          <input type="text" name="name" ref={register({ required: true })} />
          {errors.name && <p>Required!</p>}
        </div>

        <div>
          <label htmlFor="owner_name_1" className="mr-3">
            Owner Name
          </label>
          <input
            type="text"
            name="owner_name_1"
            ref={register({ required: true })}
          />
          {errors.owner_name_1 && <p>Required!</p>}
        </div>
        <div>
          <label htmlFor="owner_address_1" className="mr-3">
            Address
          </label>
          <input
            type="text"
            name="owner_address_1"
            ref={register({ required: true })}
          />
          {errors.owner_address_1 && <p>Required!</p>}
        </div>

        <div>
          <label htmlFor="referralId" className="mr-3">
            Referral Code (Optional)
          </label>
          <input type="text" name="referralId" ref={register()} />
          {errors.referralId && <p>Required!</p>}
        </div>

        <Button type="submit">
          Create Gnosis Safe {loading && <span className="ml-3">Loading</span>}
        </Button>
      </form>
    </div>
  );
}
