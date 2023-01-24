export interface DevotionalType {
	date: any;
	title: string;
	text: string;
	mainText: string;
	content: string;
	confession: string;
	furtherReading: string[];
	oneYearBibleReading: string[];
	twoYearsBibleReading: string[];
	createdBy: string;
	updatedBy: string;
	views: number;
	_id: string;
}

export type UncertainObjectType = {
	[key: string]: any;
};

export interface EventType {
	name: string;
	theme: string;
	mainText: string;
	date: string;
	time: string;
	allowRegistration: boolean;
	registrationEntries: any[];
	gallery: string[];
	limitedNumberRegistration: boolean;
	registrationNumberLimit: number;
	limitedDateRegistration: boolean;
	registrationDateLimit: Date;
	requiredRegistrationDetails: any[];
	poster: string;
	createdBy: string;
	updatedBy: string;
	_id: string;
}

export interface TestimonyType {
	fullName: string;
	summary: string;
	content: string;
	status: string;
	source: string
	updatedBy: string;
	_id: string;
}

export interface AdminType {
	fullname: string;
	email: string;
	avatar: string;
	role: string;
	password: string;
	active: boolean;
	verificationCode: string;
	createdBy: string;
	updatedBy: string;
	_id: string;
}
