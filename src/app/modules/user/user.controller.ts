import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';

const createAdmin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserServices.createAdmin(payload);

  sendResponse.sendCreateDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser();

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users getting successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  // console.log(req.params)
  const userId = req.params.userId;

  const result = await UserServices.getSingleUser(userId);

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User getting successfully',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const body = req.body;
  const result = await UserServices.updateUser(userId, body);

  sendResponse.sendDataResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  await UserServices.deleteUser(userId);

  sendResponse.sendUpdateResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully',
    data: {},
  });
});

export const UserControllers = {
  createAdmin,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
