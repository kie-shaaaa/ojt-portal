import { Body, Controller, Put } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { ApplicationStatus } from '../data/types';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentService: AppointmentsService) { }
    
    @Put('add-appointment')
    async addAppointment(
        @Body() body: {status: ApplicationStatus, }
    ) {

    }
}
