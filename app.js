import express from 'express';
import cors from "cors"
import config from "./config/config.js";
import './config/db.js'
import routes from "./routes/index.js";
import passport from "./config/passport.js";
import './jobs/index.js';

const app = express();
app.use(cors())
// app.options('*', cors());
app.use(express.json());

// route
app.use('/api/leaveTypes', passport.authenticate('jwt', {session: false}), routes.leaveTypes);
app.use('/api/branches', passport.authenticate('jwt', {session: false}), routes.branches);
app.use('/api/employees', passport.authenticate('jwt', {session: false}), routes.employees);
app.use('/api/officeShifts', passport.authenticate('jwt', {session: false}), routes.officeShifts);
app.use('/api/designations', passport.authenticate('jwt', {session: false}), routes.designations);
app.use('/api/holidays', passport.authenticate('jwt', {session: false}), routes.holidays);
app.use('/api/leaves', passport.authenticate('jwt', {session: false}), routes.leave);
app.use('/api/employeeContracts', passport.authenticate('jwt', {session: false}), routes.contract);
app.use('/api/paymentProfile', passport.authenticate('jwt', {session: false}), routes.paymentProfile);
app.use('/api/departments', passport.authenticate('jwt', {session: false}), routes.departments);
app.use('/api/predicts', routes.predict);
app.use('/api/attendances', passport.authenticate('jwt', {session: false}), routes.attendances);
app.use('/api/locations', passport.authenticate('jwt', {session: false}), routes.locations);
app.use('/api/payrolls', passport.authenticate('jwt', {session: false}), routes.payroll);
app.use('/api/settings', routes.setting);
app.use('/api/auth', routes.auth);

// Start the server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});