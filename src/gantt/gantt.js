import { api, LightningElement, track } from "lwc";
import { simulatedData } from "./simulatedData";

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

export default class Gantt extends LightningElement {
  @api range;
  @api rangeUnit;
  @api interval;
  @api intervalUnit;

  @track _switchLabel = "Show Attributes";
  get switchLabel() {
    return this._switchLabel;
  }

  constructor() {
    super();
    this._groupsData = simulatedData.map((x) => {
      return { ...x, ...{ expanded: false } };
    });
  }

  handleSwitch() {
    const attributes = this.template.querySelector('[data-id="attributes"]');
    if (attributes.classList.contains("slds-hide")) {
      attributes.classList.remove("slds-hide");
      this._switchLabel = "Hide Attributes";
    } else {
      attributes.classList.add("slds-hide");
      this._switchLabel = "Show Attributes";
    }
  }

  get rangeUnitOptions() {
    return [
      { label: "Day", value: "day", id: 1 },
      { label: "Hour", value: "hour", id: 2 }
    ];
  }

  get intervalUnitOptions() {
    return [
      { label: "Hour", value: "hour", id: 1 },
      { label: "Minute", value: "minute", id: 2 }
    ];
  }

  handleRangeChange(event) {
    this.range = event.detail.value;
  }

  handleRangeUnitChange(event) {
    this.rangeUnit = event.detail.value;
  }

  handleIntervalChange(event) {
    this.interval = event.detail.value;
  }

  handleIntervalUnitChange(event) {
    this.intervalUnit = event.detail.value;
  }

  handleGroupClick(event) {
    const group = this._groupsData.find((x) => x.id === event.detail.id);
    group.expanded = !group.expanded;
  }

  @track
  _groupsData = [];

  get groupsData() {
    return this._groupsData;
  }

  get timeSlots() {
    let slots = [];

    for (let idx = 0; idx < this.totalUnits; idx++) {
      slots.push({ id: idx, start: idx * this.interval, end: (idx + 1) * this.interval });
    }
    return slots;
  }

  get totalUnits() {
    let totalSlots = 0;
    if (this.rangeUnit === "day") {
      if (this.intervalUnit === "hour") {
        totalSlots = (this.range * HOURS_IN_DAY) / this.interval;
      } else if (this.intervalUnit === "minute") {
        totalSlots = (this.range * HOURS_IN_DAY * MINUTES_IN_HOUR) / this.interval;
      }
    } else if (this.rangeUnit === "hour") {
      if (this.intervalUnit === "hour") {
        totalSlots = Math.ceil(this.range / this.interval);
      } else if (this.intervalUnit === "minute") {
        totalSlots = (this.range * MINUTES_IN_HOUR) / this.interval;
      }
    }

    return totalSlots;
  }

  get rangeData() {
    const rangeData = [];
    for (let i = 0; i < this.range; i++) {
      rangeData.push({ total: this.range, id: i + 1 });
    }
    return rangeData;
  }

  get colSpanForRange() {
    return this.totalUnits / this.range;
  }

  get colSpanForGroup() {
    return this.totalUnits + this.colSpanForSubGroup;
  }

  get colSpanForSubGroup() {
    return 1;
  }
}
