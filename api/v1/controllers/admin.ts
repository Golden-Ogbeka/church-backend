import bcrypt from 'bcryptjs';
import { getUserDetails } from '../../../functions/auth';
import { AdminType } from '../../../types/index';
import { getPaginationOptions } from '../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express';
import AdminModel from '../../../models/admin.model';
import { getDateFilters } from '../../../functions/filters';

export default () => {
	const GetAllAdmins = async (
		req: express.Request<
			never,
			never,
			never,
			{ page: number; limit: number; from: string; to: string }
		>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const paginationOptions = getPaginationOptions(req);

			// find all admins

			const adminsData = await AdminModel.paginate(
				getDateFilters(req),
				paginationOptions
			);

			return res.status(200).json({
				message: 'All Admins Retrieved',
				data: adminsData,
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	const AddAdmin = async (
		req: express.Request<never, never, AdminType>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const { email, password, fullname } = req.body;

			const userDetails = await getUserDetails(req as any);

			// Check if admin exists

			let existingUser = await AdminModel.findOne({ email });
			if (existingUser && Object.keys(existingUser).length)
				return res.status(401).json({ message: 'Admin already exists' });

			// Hash password
			bcrypt.hash(password, 8, async function (err: any, hash: any) {
				// Store hash in your password DB.
				//Store new admin
				let newAdmin = await AdminModel.create({
					email,
					password: hash,
					fullname,
					createdBy: userDetails.fullname,
					updatedBy: userDetails.fullname,
				});

				return res.status(200).json({
					message: 'Admin created successfully',
					admin: newAdmin,
				});
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	const ViewAdmin = async (
		req: express.Request<{ id: string }>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const { id } = req.params;

			// find admin

			const adminData = await AdminModel.findById(id);

			if (!adminData) return res.status(404).json({ message: 'Admin not found' });

			return res.status(200).json({
				message: 'Admin retrieved',
				admin: adminData,
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	const DeleteAdmin = async (
		req: express.Request<{ id: string }>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const { id } = req.params;

			// find admin

			const adminData = await AdminModel.findById(id);

			if (!adminData) return res.status(404).json({ message: 'Admin not found' });

			await AdminModel.findByIdAndDelete(id);

			return res.status(200).json({
				message: 'Admin deleted',
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	interface StatusBody extends AdminType {
		id: string;
		status: boolean;
	}
	const ChangeAdminStatus = async (
		req: express.Request<never, never, StatusBody>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const { id, status } = req.body;

			const userDetails = await getUserDetails(req as any);

			const existingAdmin = await AdminModel.findById(id);
			if (!existingAdmin) return res.status(401).json({ message: 'Admin not found' });

			existingAdmin.active = status;
			existingAdmin.updatedBy = userDetails.fullname;

			await existingAdmin.save();

			return res.status(200).json({
				message: 'Admin updated successfully',
				admin: existingAdmin,
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	interface BodyType extends AdminType {
		id: string;
	}
	const MakeSuperAdmin = async (
		req: express.Request<never, never, BodyType>,
		res: express.Response
	) => {
		try {
			// check for validation errors
			const errors = validationResult(req);
			if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

			const { id } = req.body;

			const userDetails = await getUserDetails(req as any);

			const existingAdmin = await AdminModel.findById(id);
			if (!existingAdmin) return res.status(401).json({ message: 'Admin not found' });

			existingAdmin.role = 'superAdmin';
			existingAdmin.updatedBy = userDetails.fullname;

			await existingAdmin.save();

			return res.status(200).json({
				message: 'Admin updated successfully',
				admin: existingAdmin,
			});
		} catch (error) {
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	};

	return {
		GetAllAdmins,
		AddAdmin,
		ViewAdmin,
		DeleteAdmin,
		ChangeAdminStatus,
		MakeSuperAdmin,
	};
};
