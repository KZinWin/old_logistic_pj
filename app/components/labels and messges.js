import { psw_min_length } from "./common";

// common messages
    // register or update
    export const succRegister = 'Successfully Registered';
    export const succAssign = 'Successfully Assigned';
    export const succUpdate = 'Successfully Updated';
    export const undelivered = 'Undelivered';
    export const succdelivered  = 'Delivered!';
    export const succpickedUp = 'Picked Up';
    export const saved = 'Saved';
    export const failed = 'Failed';
    export const alreadyAssigned = 'Already Assigned!';

    //  conflict err message4
    export const conflictErr = 'These Data are Updated before! ';
    // unassign or delete
    export const succDelete = 'Successfully Deleted';
    export const succUnassign = 'Successfully Unassigned';

    // general error
    export const genError = 'Something Went Wrong!';
    export const conflictMess = 'Data conflicted! please refill update data.';
    export const TandCMessage = 'make sure to agree with our term and condition';

    // validate error message with photo
    export const validErrMesswithPhoto = 'Make sure to fill all required fields and photo!' ;
    export const validErrormessage = 'Make sure to fill all required field!' ;

    // password error message 
    export const lengthValide = `Password length must be ${psw_min_length} or more than ${psw_min_length} characters`;
    export const pswNotMatch = "Password doesn't match!";
    export const pswMatch = 'Password match';
    export const pswEmptyValid = 'Password must be filled!';

    // require field with packaging phot validation
    export const req_field_with_pack_photo = 'Must fill all of require field and packaging photos!';
    export const invalid_qr_message = "Invalid QR";

    // no pick up image message 
    export const no_pickUp_image = "No Picked Up Images"

// common form labels
    // general form labels
    export const App_Name = 'Digital MM'
    export const State_label = 'Select State'; 
    export const Tsp_label = 'Select Township';
    export const name_label = 'Name';
    export const email_label = 'Email';
    export const ph_label = 'Phone Number'
    export const password_label = 'Password'
    export const conf_password_label = 'Comfirm Password'
    export const home_st_label = 'House Number/Street'
    export const ward_label = 'Ward'
    export const post_code_label = 'Postcode'
    export const nrc_label = "NRC/Password/Student"
    export const agree_label ='Agree Terms & Conditions'
    export const date_label = "Date"
    export const choose_category_label = "Choose Category"
    export const category_label = "Category"
    export const amount_label = "Amount"
    export const remark_labe = "Remark"
    // fleet labels
    export const fleet_information_label = "Fleet Information"
    export const fleet_name_label = 'Fleet Name'
    export const fleet_numb_label = 'Fleet Number'
    export const choose_fleet_label = "Choose Fleet"
    export const plate_numb_label = 'Plate Number'
    export const select_type_label = "Select Type"
    export const year_label = "Year"
    export const cost_label = "Cost"
    export const note_label = 'Note'
    export const registration_num_label = "Registration Number"
    // btn labels 
    export const next_label = "Next"
    export const reassign_label = "Reassign"
    export const unassign_label = 'Unassign'
    export const unassigned_label = "Unassigned"
    export const assigned_label = "Assigned"
    export const assign_label = "Assign"
    export const register_label = "Register"
    export const delete_label = "Delete"
    export const save_label = "Save"
    export const update_label = "Update"
    export const back_label = "Back"
    export const pickup_label = "Picked Up"
    export const delivery_label = "Delivery"
    export const delivered_label = "Delivered"
    export const undeliver_label = 'Undeliver'
    // expense 
    export const monthly_exp_label = 'Monthly Expense'
    export const daily_exp_label = 'Daily Expense'
    export const type_label = 'Type'
    // package entry
    export const receiver_information_label = "Receiver Information"
    export const package_information_label = "Package Information"
    export const packageSize_label = 'Package Size'
    export const width_height_label = 'Width x Height'
    export const packagingPhoto_label = 'Packaging Photo'
    export const pickUpDate_label = "Pick Up Date"
    export const select_pickUpDate_label = "Select Pick Up Date"
    export const deliDate_label ="Delivery Date"
    export const select_deliDate_label ="Select Delivery Date"
    export const total_charge_label = "Total Charge: "
    export const qty_label = 'Quantity'
    export const receiver_label = 'Receiver'
    export const receiver_email_label = 'Receiver Email'
    export const pick_up_address_label = "Pick Up Address"
    export const deli_address_label = "Deliver Address"
    export const pickUp_images_label =  "Picked Up Images"
    export const delivered_images_label =  "Delivered Images"
    // packagesize
    export const weight_label = "Weight(kg)"
    export const size_label = "Size"
    export const width_label = "Width"
    export const height_label = "Height"
    export const price_label = 'Price'
    export const laborFee_label = 'LaborFee '
    export const insurance_label = 'Insurance '
    // sender
    export const pickUp_information_label = "Pick Up Information"
    export const sender_information_label = "Sender Information"
    export const sender_name_label = 'Sender Name'
    export const sender_label = 'Sender'
    export const select_sender_label =  "Select Sender"
    // payment
    export const register_paymentacc_label = "REGISTER PAYMENT ACCOUNT"
    export const select_bank_label = "Select Bank"
    export const acc_num_label = 'Account Number'
    // auth
    export const enter_otp_label = 'Enter Your OTP Number'
    // driver
    export const driver_license_label = "Driver License"
    export const driver_nrc_label = "NRC"
    export const register_fleet_label = "REGISTER FLEET"
    export const driver_register_num_label = "Register Number"
    export const driver_cartype_label = "Type Of Car"
    export const driver_select_cartype_label = "Select Type Of Car"
    export const driver_plate_num_label = "Plate Number"
    export const year_of_production_label = "Year Of Production"
    // bussiness info
    export const busi_information_label = "BUSINESS INFORMATION"
    export const busi_hour = "BUSINESS HOUR"
    export const busi_days = "Days"
    export const busi_from = "From"
    export const busi_to = "to"
    export const busi_about = "ABOUT YOUR BUSINESS"
    export const busi_name_label = "Business Name"
    export const busi_ph_label = "Business Phone"
    export const busi_email_label = "Business Email Adress"
    export const busi_reg_num_label = "Business Registration Number"
    export const busi_cate_label = "Business Category"
    export const busi_subcate_label = "Business Sub Category"
    export const busi_address_label = "BUSINESS ADDRESS"
    // user info
    export const general_information_label = "GENERAL INFORMATION"
    export const your_address_label = "YOUR ADDRESS"

