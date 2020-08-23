import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: any) {
        value = value.toUpperCase();
        console.log(!this.isStatusValid(value));

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`'${value}' is an invalid status`)
        }

        return value
    }

    private isStatusValid(status: any) {
        const index = this.allowedStatus.indexOf(status);
        return index !== -1
    }

}