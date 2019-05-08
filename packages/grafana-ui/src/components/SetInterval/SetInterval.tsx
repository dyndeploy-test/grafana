import { PureComponent } from 'react';
import { interval, Subscription, empty, Subject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { stringToMs } from '../../utils/string';

interface Props {
  func: () => any; // TODO
  loading: boolean;
  interval: string;
}

export class SetInterval extends PureComponent<Props> {
  private propsSubject: Subject<Props>;
  private subscription: Subscription;

  constructor(props: Props) {
    super(props);
    this.propsSubject = new Subject<Props>();
    this.subscription = this.propsSubject
      .pipe(
        switchMap(props => {
          return props.loading ? empty() : interval(stringToMs(props.interval));
        }),
        tap(() => this.props.func())
      )
      .subscribe();
    this.propsSubject.next(props);
  }

  componentDidUpdate() {
    this.propsSubject.next(this.props);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.propsSubject) {
      this.propsSubject.unsubscribe();
    }
  }

  render() {
    return null;
  }
}
