import React, { useState } from "react";
import { DialogBox } from "../../UI/DialogBox";
import { UserAddressEditForm } from "../../Forms/AddressForms/UserAddressEditForm";
import { IAddress } from "../../../types/user.types";
import {
  useAppDispatch,
  useAppSelector,
  useEditUserAddress,
} from "../../../hooks";
import { Grid, Skeleton } from "@mui/material";
import { setAddressId } from "../../../state/slices/checkout.slice";
import { AddAddress } from "../../account/Sections/Address/AddAddress";
import { Address } from "../../account/Sections/Address/Address";
import { setDialogBoxOpen } from "../../../state/slices/dialog.slice";

export const AddressSelector = () => {
  const { address } = useAppSelector((state) => state.addressState);

  const [handleSubmit] = useEditUserAddress();

  const dispatch = useAppDispatch();

  const { addressId } = useAppSelector((state) => state.checkoutState);

  const handleSubmitEditForm = (data: IAddress) => {
    if (addressId !== "") {
      handleSubmit(data, false);
      dispatch(setAddressId(""));
    } else {
      handleSubmit(data, true);
    }
    dispatch(setDialogBoxOpen(false));
  };

  return (
    <>
      {!address ? (
        <div className="mt-2 w-[100%] rounded-lg">
          <Skeleton variant="text" className="text-md md:text-2xl" />
          <div className="mt-5 flex flex-wrap gap-8">
            {Array(4)
              .fill("sdfs")
              .map((v, i) => {
                return (
                  <Skeleton
                    variant="rounded"
                    height={150}
                    key={i}
                    className="aspect-video h-[350px] w-[90%] max-w-[250px] rounded-lg p-3 md:p-5"
                  />
                );
              })}
          </div>
        </div>
      ) : (
        <div className="mt-2 w-[100%] rounded-lg">
          <h3 className="text-md font-head font-semibold md:text-2xl">
            Select your Address
          </h3>
          <div className="mt-5 flex justify-center gap-5 md:gap-8">
            <Grid container spacing={2}>
              {address.map((v, i) => {
                return (
                  <React.Fragment key={`${i}--${v.addressName}`}>
                    <Grid item xs={12} md={4} lg={4}>
                      <Address {...v} key={i} selector selectedId={addressId} />
                    </Grid>
                  </React.Fragment>
                );
              })}
              <Grid item xs={12} md={4} lg={4}>
                <AddAddress />
              </Grid>
            </Grid>
          </div>
          <DialogBox>
            <UserAddressEditForm handleSubmit={handleSubmitEditForm} />
          </DialogBox>
        </div>
      )}
    </>
  );
};
