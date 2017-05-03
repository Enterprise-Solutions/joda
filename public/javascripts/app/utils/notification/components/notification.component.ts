import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {Notification} from '../interfaces/notification.interface';

@Component({
    selector: 'notifications',
    templateUrl: 'assets/javascripts/app/utils/notification/components/templates/notification.template.html',
    styles: [`
        #notification {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 5000;
        }
    `]
})

export class NotificationComponent implements OnInit {
    @Input() public notification: Notification;
    @Output() public close = new EventEmitter();

    public title: string;
    public class: string;
    public icon: string;

    ngOnInit() {
        switch (this.notification.status) {
            case 'success':
                this.title = "OK!";
                this.class = 'alert-success';
                this.icon  = 'fa fa-check-circle';
                break;
            case 'error':
                this.title = 'ERROR!';
                this.class = 'alert-danger';
                this.icon  = 'fa fa-exclamation-circle';
                break;
            default:
                this.title = 'INFO!';
                this.class = 'alert-info';
                this.icon  = 'fa fa-lightbulb-o';
                break;
        }

        setTimeout(() => { this.closeNotification() }, 5000);
    }

    getIcon() {
        return this.icon;
    }

    getClass() {
        return this.class;
    }

    closeNotification() {
        this.close.next('OK');
    }
}