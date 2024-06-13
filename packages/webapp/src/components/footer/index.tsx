import React from 'react';
import styles from '~/components/footer/index.module.scss';
import { globalConfig } from '~/config';

export const Footer = () => {
  return <footer className={styles.footer}>{globalConfig.footer}</footer>;
};
