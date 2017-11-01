import { IGrid, IFilterMUI, EJ2Intance } from '../base/interface';
import { Column } from '../models/column';
import { FilterSettings } from '../base/grid';
import { L10n, } from '@syncfusion/ej2-base';
import { distinctStringValues } from '../base/util';
import { ServiceLocator } from '../services/service-locator';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Filter } from '../actions/filter';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FlMenuOptrUI } from './filter-menu-operator';
/**
 * `boolfilterui` render boolean column.
 * @hidden
 */

export class BooleanFilterUI implements IFilterMUI {

    private parent: IGrid;
    protected serviceLocator: ServiceLocator;
    private elem: HTMLElement;
    private value: string;
    private filterSettings: FilterSettings;
    private dropInstance: DropDownList;

    constructor(parent?: IGrid, serviceLocator?: ServiceLocator, filterSettings?: FilterSettings) {
        this.parent = parent;
        this.serviceLocator = serviceLocator;
        this.filterSettings = filterSettings;
    }
    public create(args: { column: Column, target: HTMLElement, getOptrInstance: FlMenuOptrUI, localizeText: L10n }): void {
        let data: DataManager | Object[];
        this.elem = createElement('input', { className: 'e-flmenu-input', id: 'bool-ui-' + args.column.uid });
        args.target.appendChild(this.elem);
        this.dropInstance = new DropDownList({
            dataSource: this.parent.dataSource instanceof DataManager ?
                this.parent.dataSource : new DataManager(this.parent.dataSource),
            query: new Query().select(args.column.field),
            fields: { text: args.column.field, value: args.column.field },
            placeholder: args.localizeText.getConstant('SelectValue'),
            cssClass: 'e-popup-flmenu',
            locale: this.parent.locale,
            enableRtl: this.parent.enableRtl,
            actionComplete: this.ddActionComplete

        });
        this.dropInstance.appendTo(this.elem);
    }

    public write(args: { column: Column, target: Element, parent: IGrid, filteredValue: number | string | Date | boolean }): void {
        let drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + args.column.uid)).ej2_instances[0];
        drpuiObj.text = !isNullOrUndefined(args.filteredValue) ? args.filteredValue as string : '';

    }

    public read(element: Element, column: Column, filterOptr: string, filterObj: Filter): void {
        let drpuiObj: DropDownList = (<EJ2Intance>document.querySelector('#bool-ui-' + column.uid)).ej2_instances[0];
        let filterValue: string | number = drpuiObj.value;
        filterObj.filterByColumn(column.field, filterOptr, filterValue, 'and', false);
    }

    private ddActionComplete(e: { result: string[] }): void {
        e.result = distinctStringValues(e.result);
    }
}