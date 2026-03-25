import './RevisionSwitch.css';

export interface RevisionSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const RevisionSwitch = ({ checked, onChange }: RevisionSwitchProps) => {
  return (
    <label className="revision-switch">
      <span className="revision-switch__label">Только требующие доработок</span>
      <span className="revision-switch__control">
        <input
          type="checkbox"
          className="revision-switch__input"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="revision-switch__slider" />
      </span>
    </label>
  );
};
