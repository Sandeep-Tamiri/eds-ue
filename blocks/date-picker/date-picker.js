const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function formatToday() {
  return new Date().toISOString().slice(0, 10);
}

function normalize(value) {
  const trimmed = (value || '').trim();
  return DATE_RE.test(trimmed) ? trimmed : '';
}

function extractConfig(rows) {
  const config = {
    label: '',
    name: '',
    value: '',
    helper: '',
  };

  rows.forEach((cells) => {
    if (cells.length === 1 && !config.label) {
      config.label = cells[0];
      return;
    }

    if (cells.length >= 2) {
      const key = (cells[0] || '').toLowerCase();
      const value = cells[1] || '';

      if (key === 'label') config.label = value;
      if (key === 'name') config.name = value;
      if (key === 'value') config.value = value;
      if (key === 'helper') config.helper = value;
    }
  });

  return config;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].map((cell) => cell.textContent.trim()));
  const config = extractConfig(rows);
  const today = formatToday();
  const defaultValue = normalize(config.value);
  const inputId = `date-picker-${Math.random().toString(36).slice(2, 8)}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'date-picker';

  const label = document.createElement('label');
  label.className = 'date-picker-label';
  label.setAttribute('for', inputId);
  label.textContent = config.label || 'Select date';

  const field = document.createElement('div');
  field.className = 'date-picker-field';

  const input = document.createElement('input');
  input.type = 'date';
  input.id = inputId;
  input.name = config.name || 'date';
  input.max = today;
  if (defaultValue && defaultValue <= today) {
    input.value = defaultValue;
  }

  input.addEventListener('input', () => {
    if (input.value && input.value > today) {
      input.setCustomValidity('Please select a past or current date.');
    } else {
      input.setCustomValidity('');
    }
  });

  const icon = document.createElement('span');
  icon.className = 'date-picker-icon';
  icon.setAttribute('aria-hidden', 'true');

  field.append(input, icon);

  wrapper.append(label, field);

  if (config.helper) {
    const helper = document.createElement('div');
    helper.className = 'date-picker-helper';
    helper.textContent = config.helper;
    wrapper.append(helper);
  }

  block.textContent = '';
  block.append(wrapper);
}
